import { CisV7SafeguardsImplementation } from '@/options/cisControls';
import { CisV8SafeguardsImplementation } from '@/options/cisV8Controls';
import { NistV2SafeguardsImplementation } from '@/options/nistV2Controls';
import {
  ControlsFrameworkLevels,
  ControlsFrameworkLevelsServer,
} from '@/types/riskRegister';
import {
  ISO27001ImplementationLevel,
  ImplementationLevel,
} from '@/types/sphereForm';
import { FrameworkType } from '../ScenarioDrillDown/ControlsModal';
import { Control } from '../ScenarioDrillDown/ControlsModal/columns';

export const convertFrameworkLevelsServerToFrameworkLevels = (
  controls: ControlsFrameworkLevelsServer,
): ControlsFrameworkLevels => {
  if (!controls) {
    return {
      cis_implementation_level: {},
      cis_v7_safeguards: {} as any,
      nist_implementation_level: {},
      iso27001_implementation_level: {} as any,
      cis_v8_implementation_level_igs: {},
      cis_v8_safeguards: {} as any,
      nist_v2_safeguard_implementation: {} as any,
      tisax_implementation_level: {},
      relevant_cis_controls: new Set(),
      relevant_nist_controls: new Set(),
      relevant_nist_v2_controls: new Set(),
      relevant_iso27001_controls: new Set(),
      relevant_cis_v8_controls: new Set(),
      relevant_cis_v8_safeguards: new Set(),
      relevant_cis_v7_safeguards: new Set(),
      relevant_tisax_controls: new Set(),
    };
  }

  return {
    ...controls,
    iso27001_implementation_level: convertIsoToImplementationLevel(
      controls.iso27001_implementation_level,
    ),
    cis_v8_safeguards:
      convertCisV8SafeguardsImplementationToImplementationLevel(
        controls.cis_v8_safeguards,
      ),
    cis_v7_safeguards:
      convertCisV7SafeguardsImplementationToImplementationLevel(
        controls.cis_v7_safeguards,
      ),
    nist_v2_safeguard_implementation:
      convertNistV2SafeguardsToImplementationLevel(
        controls.nist_v2_safeguard_implementation,
      ),
    tisax_implementation_level: convertTisaxToImplementationLevel(
      controls.tisax_implementation_level,
    ),
    relevant_cis_controls: new Set(controls.relevant_cis_controls || []),
    relevant_nist_controls: new Set(controls.relevant_nist_controls || []),
    relevant_nist_v2_controls: new Set(controls.relevant_nist_v2_controls || []),
    relevant_iso27001_controls: new Set(controls.relevant_iso27001_controls || []),
    relevant_cis_v8_controls: new Set(controls.relevant_cis_v8_controls || []),
    relevant_cis_v8_safeguards: new Set(controls.relevant_cis_v8_safeguards || []),
    relevant_cis_v7_safeguards: new Set(controls.relevant_cis_v7_safeguards || []),
    relevant_tisax_controls: new Set(controls.relevant_tisax_controls || []),
  };
};

export const convertFrameworkLevelsToFrameworkLevelsServer = (
  controls: ControlsFrameworkLevels,
): ControlsFrameworkLevelsServer => {
  if (!controls) {
    return {
      cis_implementation_level: {},
      cis_v7_safeguards: {} as CisV7SafeguardsImplementation,
      nist_implementation_level: {},
      iso27001_implementation_level: {} as ISO27001ImplementationLevel,
      cis_v8_implementation_level_igs: {},
      cis_v8_safeguards: {} as CisV8SafeguardsImplementation,
      nist_v2_safeguard_implementation: {} as NistV2SafeguardsImplementation,
      tisax_implementation_level: {},
      relevant_cis_controls: [],
      relevant_nist_controls: [],
      relevant_nist_v2_controls: [],
      relevant_iso27001_controls: [],
      relevant_cis_v8_controls: [],
      relevant_cis_v8_safeguards: [],
      relevant_cis_v7_safeguards: [],
      relevant_tisax_controls: [],
    };
  }

  return {
    ...controls,
    iso27001_implementation_level: convertImplementationLevelToIso(
      controls.iso27001_implementation_level,
    ),
    cis_v8_safeguards: convertImplementationLevelToCisV8(
      controls.cis_v8_safeguards,
    ),
    cis_v7_safeguards: convertImplementationLevelToCisV7(
      controls.cis_v7_safeguards,
    ),
    nist_v2_safeguard_implementation: convertImplementationLevelToNistV2(
      controls.nist_v2_safeguard_implementation,
    ),
    tisax_implementation_level: convertImplementationLevelToTisax(
      controls.tisax_implementation_level,
    ),
    relevant_cis_controls: Array.from(controls.relevant_cis_controls || new Set()),
    relevant_cis_v8_controls: Array.from(controls.relevant_cis_v8_controls || new Set()),
    relevant_cis_v8_safeguards: Array.from(controls.relevant_cis_v8_safeguards || new Set()),
    relevant_cis_v7_safeguards: Array.from(controls.relevant_cis_v7_safeguards || new Set()),
    relevant_iso27001_controls: Array.from(controls.relevant_iso27001_controls || new Set()),
    relevant_nist_controls: Array.from(controls.relevant_nist_controls || new Set()),
    relevant_nist_v2_controls: Array.from(controls.relevant_nist_v2_controls || new Set()),
    relevant_tisax_controls: Array.from(controls.relevant_tisax_controls || new Set()),
  };
};
// flattens the ISO27001ImplementationLevel to a single level ImplementationLevel
export const convertIsoToImplementationLevel = (
  iso: ISO27001ImplementationLevel,
): ImplementationLevel => {
  if (!iso) return {};

  return Object.entries(iso).reduce((acc, [_category, controls]) => {
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
  framework: FrameworkType,
  levels: ControlsFrameworkLevels,
): Control[] => {
  const relevantControlsMap = {
    cis: levels.relevant_cis_controls,
    nist: levels.relevant_nist_controls,
    nist_csf_v2: levels.relevant_nist_v2_controls,
    iso: levels.relevant_iso27001_controls,
    cis_v8: levels.relevant_cis_v8_controls,
    cis_v8_safeguards: levels.relevant_cis_v8_safeguards,
    cis_v7_safeguards: levels.relevant_cis_v7_safeguards,
    tisax: levels.relevant_tisax_controls,
  };

  const implementationLevelMap = {
    cis: levels.cis_implementation_level,
    nist: levels.nist_implementation_level,
    nist_csf_v2: levels.nist_v2_safeguard_implementation,
    iso: levels.iso27001_implementation_level,
    cis_v8: levels.cis_v8_implementation_level_igs,
    cis_v8_safeguards: levels.cis_v8_safeguards,
    cis_v7_safeguards: levels.cis_v7_safeguards,
    tisax: levels.tisax_implementation_level,
  };

  const relevantControls = relevantControlsMap[framework];
  const implementationLevel = implementationLevelMap[framework];

  // Add null check to prevent Object.entries error
  if (!implementationLevel) {
    return [];
  }

  return Object.entries(implementationLevel).map(
    ([controlId, implemented]) => ({
      name: controlId,
      relevant: relevantControls.has(controlId),
      implemented: implemented,
    }),
  );
};

export const convertCisV8SafeguardsImplementationToImplementationLevel = (
  implementationLevel: CisV8SafeguardsImplementation,
): ImplementationLevel => {
  if (!implementationLevel) return {};

  const flattenedImplementationLevel = Object.entries(
    implementationLevel,
  ).reduce((acc, [_category, controls]) => {
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
  ).reduce((acc, [_category, controls]) => {
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
    (acc, [_category, controls]) => {
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
