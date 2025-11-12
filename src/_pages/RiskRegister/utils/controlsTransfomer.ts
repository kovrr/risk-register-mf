import type { CisV7SafeguardsImplementation } from '@/options/cisControls';
import type { CisV8SafeguardsImplementation } from '@/options/cisV8Controls';
import type { NistV2SafeguardsImplementation } from '@/options/nistV2Controls';
import type {
  ControlsFrameworkLevels,
  ControlsFrameworkLevelsServer,
} from '@/types/riskRegister';
import type {
  ImplementationLevel,
  ISO27001ImplementationLevel,
} from '@/types/sphereForm';
import type { Control } from '../ScenarioDrillDown/ControlsModal/columns';

/**
 * Generic helper to flatten nested implementation levels
 * Handles structures like: { category: { controlId: value } } → { controlId: value }
 */
const flattenImplementationLevel = (data: unknown): Record<string, number> => {
  if (!data || typeof data !== 'object') return {};

  const dataObj = data as Record<string, unknown>;

  // Check if it's already flat (all values are numbers)
  const values = Object.values(dataObj);
  if (values.length > 0 && values.every((v) => typeof v === 'number')) {
    return dataObj as Record<string, number>;
  }

  // Flatten nested structure
  const flattened: Record<string, number> = {};
  Object.values(dataObj).forEach((categoryData) => {
    if (categoryData && typeof categoryData === 'object') {
      Object.entries(categoryData as Record<string, number>).forEach(
        ([controlId, value]) => {
          flattened[controlId] = value;
        },
      );
    }
  });

  return flattened;
};

export const convertFrameworkLevelsServerToFrameworkLevels = (
  controls: ControlsFrameworkLevelsServer,
): ControlsFrameworkLevels => {
  if (!controls) return {} as ControlsFrameworkLevels;

  const converted: Record<string, unknown> = {};

  // Convert all keys generically
  Object.entries(controls).forEach(([key, value]) => {
    // Convert relevant_* arrays to Sets
    if (key.startsWith('relevant_') && Array.isArray(value)) {
      converted[key] = new Set(value);
    }
    // Flatten implementation levels if needed
    else if (key.includes('implementation') || key.includes('safeguard')) {
      converted[key] = flattenImplementationLevel(value);
    }
    // Pass through everything else
    else {
      converted[key] = value;
    }
  });

  return converted as ControlsFrameworkLevels;
};

/**
 * Generic helper to unflatten implementation levels if needed
 * Handles structures like: { controlId: value } → { category: { controlId: value } }
 */
const unflattenImplementationLevel = (
  data: unknown,
  needsNesting: boolean,
): unknown => {
  if (!data || typeof data !== 'object') return data;

  const dataObj = data as Record<string, number>;

  // If doesn't need nesting, return as-is
  if (!needsNesting) return dataObj;

  // Unflatten: group by category (extracted from controlId prefix)
  const unflattened: Record<string, Record<string, number>> = {};
  Object.entries(dataObj).forEach(([controlId, value]) => {
    const category = controlId.split('-')[0];
    if (!unflattened[category]) {
      unflattened[category] = {};
    }
    unflattened[category][controlId] = value;
  });

  return unflattened;
};

export const convertFrameworkLevelsToFrameworkLevelsServer = (
  controls: ControlsFrameworkLevels,
): ControlsFrameworkLevelsServer => {
  if (!controls) return {} as ControlsFrameworkLevelsServer;

  const converted: Record<string, unknown> = {};

  // Convert all keys generically
  Object.entries(controls).forEach(([key, value]) => {
    // Convert relevant_* Sets to Arrays
    if (key.startsWith('relevant_') && value instanceof Set) {
      converted[key] = Array.from(value);
    }
    // Unflatten implementation levels that need nested structure
    else if (
      key.includes('safeguard') ||
      key === 'iso27001_implementation_level' ||
      key === 'cis_v8_safeguards' ||
      key === 'cis_v7_safeguards' ||
      key === 'nist_v2_safeguard_implementation'
    ) {
      const needsNesting =
        key.includes('safeguard') || key.includes('iso27001');
      converted[key] = unflattenImplementationLevel(value, needsNesting);
    }
    // Pass through everything else
    else {
      converted[key] = value;
    }
  });

  return converted as ControlsFrameworkLevelsServer;
};
// flattens the ISO27001ImplementationLevel to a single level ImplementationLevel
export const convertIsoToImplementationLevel = (
  iso: ISO27001ImplementationLevel,
): ImplementationLevel => {
  if (!iso) return {};

  return Object.entries(iso).reduce((acc, [category, controls]) => {
    Object.entries(controls).forEach(([controlNumber, value]) => {
      acc[controlNumber] = value;
    });
    return acc;
  }, {} as ImplementationLevel);
};

export const convertImplementationLevelToIso = (
  implementationLevel: ImplementationLevel,
): ISO27001ImplementationLevel => {
  if (!implementationLevel) return {} as ISO27001ImplementationLevel;

  return Object.entries(implementationLevel).reduce(
    (acc, [controlNumber, value]) => {
      const category = controlNumber.split('-')[0];
      if (!acc[category]) {
        acc[category] = {};
      }
      acc[category][controlNumber] = value;
      return acc;
    },
    {} as any,
  ) as ISO27001ImplementationLevel;
};

export const getControlsFromFramework = (
  levels: ControlsFrameworkLevels,
  frameworkControlsKey: string,
  frameworkImplementationKey: string,
  allowedControlIds?: Set<string>,
): Control[] => {
  // Get controls and implementation level dynamically from scenario data
  const relevantControls = (levels as Record<string, unknown>)[
    frameworkControlsKey
  ];
  const implementationLevel = (levels as Record<string, unknown>)[
    frameworkImplementationKey
  ];

  const resolvedAllowedControlIds = new Set<string>(
    allowedControlIds ? Array.from(allowedControlIds) : [],
  );

  if (resolvedAllowedControlIds.size === 0) {
    if (relevantControls instanceof Set) {
      relevantControls.forEach((id: string) =>
        resolvedAllowedControlIds.add(id),
      );
    } else if (Array.isArray(relevantControls)) {
      relevantControls.forEach((id: string) =>
        resolvedAllowedControlIds.add(id),
      );
    }

    if (implementationLevel && typeof implementationLevel === 'object') {
      Object.keys(implementationLevel as Record<string, number>).forEach(
        (id) => {
          resolvedAllowedControlIds.add(id);
        },
      );
    }
  }

  // ALWAYS render ALL controls from Framework API (allowedControlIds)
  // Scenario data only determines checkbox states
  const controls = Array.from(resolvedAllowedControlIds).map((controlId) => {
    // Default values if no scenario data exists
    let relevant = false;
    let implemented = 0;

    // Check if control is in relevant controls set
    if (relevantControls && relevantControls instanceof Set) {
      relevant = relevantControls.has(controlId);
    }

    // Check implementation level from scenario data
    if (implementationLevel && typeof implementationLevel === 'object') {
      const implLevel = (implementationLevel as Record<string, number>)[
        controlId
      ];
      implemented = implLevel !== undefined ? implLevel : 0;
    }

    return {
      name: controlId,
      relevant,
      implemented,
    };
  });

  return controls;
};

export const convertCisV8SafeguardsImplementationToImplementationLevel = (
  implementationLevel: CisV8SafeguardsImplementation,
): ImplementationLevel => {
  if (!implementationLevel) return {};

  const flattenedImplementationLevel = Object.entries(
    implementationLevel,
  ).reduce((acc, [category, controls]) => {
    Object.entries(controls).forEach(([controlNumber, value]) => {
      acc[controlNumber] = value;
    });
    return acc;
  }, {} as any) as ImplementationLevel;
  return flattenedImplementationLevel;
};

export const convertImplementationLevelToCisV8 = (
  implementationLevel: ImplementationLevel,
): CisV8SafeguardsImplementation => {
  if (!implementationLevel) return {} as CisV8SafeguardsImplementation;

  const unflattenedImplementationLevel = Object.entries(
    implementationLevel,
  ).reduce((acc, [controlNumber, value]) => {
    const category = controlNumber.split('-')[0];
    if (!acc[category]) {
      acc[category] = {};
    }
    acc[category][controlNumber] = value;
    return acc;
  }, {} as any) as CisV8SafeguardsImplementation;
  return unflattenedImplementationLevel;
};

export const convertCisV7SafeguardsImplementationToImplementationLevel = (
  implementationLevel: CisV7SafeguardsImplementation,
): ImplementationLevel => {
  if (!implementationLevel) return {};

  const flattenedImplementationLevel = Object.entries(
    implementationLevel,
  ).reduce((acc, [category, controls]) => {
    Object.entries(controls).forEach(([controlNumber, value]) => {
      acc[controlNumber] = value;
    });
    return acc;
  }, {} as any) as ImplementationLevel;
  return flattenedImplementationLevel;
};

export const convertImplementationLevelToCisV7 = (
  implementationLevel: ImplementationLevel,
): CisV7SafeguardsImplementation => {
  if (!implementationLevel) return {} as CisV7SafeguardsImplementation;

  const unflattenedImplementationLevel = Object.entries(
    implementationLevel,
  ).reduce((acc, [controlNumber, value]) => {
    const category = controlNumber.split('-')[0];
    if (!acc[category]) {
      acc[category] = {};
    }
    acc[category][controlNumber] = value;
    return acc;
  }, {} as any) as CisV7SafeguardsImplementation;
  return unflattenedImplementationLevel;
};

export const convertTisaxToImplementationLevel = (
  implementationLevel: ImplementationLevel,
): ImplementationLevel => {
  return implementationLevel || {};
};

export const convertImplementationLevelToTisax = (
  implementationLevel: ImplementationLevel,
): ImplementationLevel => {
  return implementationLevel || {};
};

export const convertNistV2SafeguardsToImplementationLevel = (
  implementationLevel: NistV2SafeguardsImplementation,
): ImplementationLevel => {
  return Object.entries(implementationLevel).reduce(
    (acc, [category, controls]) => {
      Object.entries(controls).forEach(([controlNumber, value]) => {
        acc[controlNumber] = value;
      });
      return acc;
    },
    {} as any,
  ) as ImplementationLevel;
};

export const convertImplementationLevelToNistV2 = (
  implementationLevel: ImplementationLevel,
): NistV2SafeguardsImplementation => {
  if (!implementationLevel) return {} as NistV2SafeguardsImplementation;

  const unflattenedImplementationLevel = Object.entries(
    implementationLevel,
  ).reduce((acc, [controlNumber, value]) => {
    const category = controlNumber.split('-')[0];
    if (!acc[category]) {
      acc[category] = {};
    }
    acc[category][controlNumber] = value;
    return acc;
  }, {} as any) as NistV2SafeguardsImplementation;
  return unflattenedImplementationLevel;
};
