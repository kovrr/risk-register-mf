import {
  FrameworkCategorySchema,
  FrameworkResponse,
  FrameworkResponseList,
  SubCategoryDetailSchema,
} from '@/types/frameworkType';

export interface ProcessedFramework {
  key: string; // unique key for the framework (e.g., 'cis_v8', 'cis_v8_safeguards')
  title: string; // display title from API
  controlsKey: string; // key for relevant_controls array (e.g., 'relevant_cis_v8_control')
  implementationLevelKey: string; // key for implementation level (e.g., 'cis_v8_control_implementation')
  controls: Map<string, { title: string; description: string; reference?: string }>; // control_id -> details
  hasSubcategories: boolean; // whether this framework has subcategories
  allowedControlIds: Set<string>; // Filter: Only show these control IDs in the table
}

/**
 * Generates a normalized framework key from name and version
 * Example: "NIST" + "v2" -> "nist_v2"
 */
const normalizeFrameworkKey = (frameworkName: string, frameworkVersion: string): string => {
  const name = frameworkName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  const version = frameworkVersion.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_.]/g, '');
  return `${name}_${version}`;
};

/**
 * Generates the frontend UI key (for framework identification in dropdown)
 */
export const generateFrameworkKey = (
  frameworkName: string,
  frameworkVersion: string,
  isSubcategory: boolean,
): string => {
  const baseKey = normalizeFrameworkKey(frameworkName, frameworkVersion);
  return isSubcategory ? `${baseKey}_safeguards` : baseKey;
};

/**
 * Generates the controls key for relevant_controls
 * Example: 'relevant_cis_v8_control'
 */
export const generateControlsKey = (
  frameworkName: string,
  frameworkVersion: string,
  label: string,
): string => {
  const baseKey = normalizeFrameworkKey(frameworkName, frameworkVersion);
  return `relevant_${baseKey}_${label}`;
};

/**
 * Generates the implementation level key
 * Example: 'cis_v8_control_implementation'
 */
export const generateImplementationKey = (
  frameworkName: string,
  frameworkVersion: string,
  label: string,
): string => {
  const baseKey = normalizeFrameworkKey(frameworkName, frameworkVersion);
  return `${baseKey}_${label}_implementation`;
};

/**
 * Process a single framework and extract controls
 * Fully generic - works purely from API structure
 */
export const processFrameworkControls = (
  framework: FrameworkResponse,
): ProcessedFramework[] => {
  const frameworks: ProcessedFramework[] = [];
  const frameworkName = framework.framework_name;
  const frameworkVersion = framework.framework_version;
  // Fallback to default labels if not provided by API
  const controlLabel = framework.control_implementation_label || 'control';
  const subControlLabel = framework.sub_control_implementation_label || 'safeguard';

  // Check if framework has subcategories
  const hasSubcategories = framework.categories.some(
    (cat: FrameworkCategorySchema) => cat.subcategories && cat.subcategories.length > 0,
  );

  // Grouped frameworks OR frameworks without subcategories: Single level
  if (framework.framework_handler_type === 'grouped' || !hasSubcategories) {
    const key = generateFrameworkKey(frameworkName, frameworkVersion, false);
    const controlsMap = new Map<string, { title: string; description: string; reference?: string }>();
    const allowedControlIds = new Set<string>();

    // Extract each category: id, name, description
    framework.categories.forEach((category: FrameworkCategorySchema) => {
      controlsMap.set(category.id, {
        title: category.name,
        description: category.description || category.name,
        reference: category.category_num?.toString(),
      });
      allowedControlIds.add(category.id);
    });

    const controlsKey = generateControlsKey(frameworkName, frameworkVersion, controlLabel);
    const implementationKey = generateImplementationKey(frameworkName, frameworkVersion, controlLabel);

    frameworks.push({
      key,
      title: `${frameworkName} ${frameworkVersion}`,
      controlsKey,
      implementationLevelKey: implementationKey,
      controls: controlsMap,
      hasSubcategories: false,
      allowedControlIds,
    });
  }
  // Frameworks with subcategories: Split into Controls Level and Safeguards Level
  else {
    const baseKey = normalizeFrameworkKey(frameworkName, frameworkVersion);

    // Collect ALL controls (both categories and subcategories) with their metadata
    const allControlsMap = new Map<string, { title: string; description: string; reference?: string }>();
    const categoryIds = new Set<string>();
    const subcategoryIds = new Set<string>();

    framework.categories.forEach((category: FrameworkCategorySchema) => {
      // Add category with id, name, description
      allControlsMap.set(category.id, {
        title: category.name,
        description: category.description || category.name,
        reference: category.category_num?.toString(),
      });
      categoryIds.add(category.id);

      // Collect all subcategories from all categories
      if (category.subcategories) {
        category.subcategories.forEach((subcat: SubCategoryDetailSchema) => {
          allControlsMap.set(subcat.id, {
            title: subcat.name,
            description: subcat.description || subcat.name,
            reference: subcat.framework_reference,
          });
          subcategoryIds.add(subcat.id);
        });
      }
    });

    // 1. Controls Level - Show only categories
    const controlsControlsKey = generateControlsKey(frameworkName, frameworkVersion, controlLabel);
    const controlsImplementationKey = generateImplementationKey(frameworkName, frameworkVersion, controlLabel);

    frameworks.push({
      key: baseKey,
      title: `${frameworkName} ${frameworkVersion} - ${controlLabel.charAt(0).toUpperCase() + controlLabel.slice(1)} Level`,
      controlsKey: controlsControlsKey,
      implementationLevelKey: controlsImplementationKey,
      controls: allControlsMap,
      hasSubcategories: false,
      allowedControlIds: categoryIds, // Filter to only show category IDs
    });

    // 2. Safeguards Level - Show only subcategories (collected from all categories)
    const safeguardsKey = generateFrameworkKey(frameworkName, frameworkVersion, true);
    const safeguardsControlsKey = generateControlsKey(frameworkName, frameworkVersion, subControlLabel);
    const safeguardsImplementationKey = generateImplementationKey(frameworkName, frameworkVersion, subControlLabel);

    frameworks.push({
      key: safeguardsKey,
      title: `${frameworkName} ${frameworkVersion} - ${subControlLabel.charAt(0).toUpperCase() + subControlLabel.slice(1)} Level`,
      controlsKey: safeguardsControlsKey,
      implementationLevelKey: safeguardsImplementationKey,
      controls: allControlsMap,
      hasSubcategories: true,
      allowedControlIds: subcategoryIds, // Filter to only show subcategory IDs
    });
  }

  return frameworks;
};

/**
 * Process all frameworks from the API response
 */
export const processAllFrameworks = (
  frameworksList: FrameworkResponseList,
): Map<string, ProcessedFramework> => {
  const processedFrameworks = new Map<string, ProcessedFramework>();

  frameworksList.forEach((framework: FrameworkResponse) => {
    const frameworks = processFrameworkControls(framework);
    frameworks.forEach((fw: ProcessedFramework) => {
      processedFrameworks.set(fw.key, fw);
    });
  });

  return processedFrameworks;
};
