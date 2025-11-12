export interface MaturityLevelSchema {
  id: string;
  label: string;
  int_value: number;
  description?: string;
}

export interface SubCategoryDetailSchema {
  id: string; // e.g., "ICEA-1"
  name: string;
  framework_reference?: string; // dot notation / dash notation (e.g., "1.1")
  description?: string;
  // Generic maturity level support
  maturity_scores?: Record<number, number>;
}

export interface FrameworkCategorySchema {
  id: string;
  name: string;
  category_num?: number;
  description?: string;
  subcategories?: SubCategoryDetailSchema[];
  // For frameworks without sub-controls
  maturity_scores?: Record<number, number>;
  // For storing framework-specific metadata
  metadata?: Record<string, unknown>;
}

export interface FrameworkBase {
  framework_name: string;
  framework_version: string;
  title: string;
  type: "custom" | "official" | "hidden";
  control_implementation_label: string;
  sub_control_implementation_label: string;
  framework_handler_type: string;
  accept_inapplicable: boolean;

  maturity_levels?: MaturityLevelSchema[];
  categories: FrameworkCategorySchema[];
  is_active: boolean;
}

export interface FrameworkResponse extends FrameworkBase {
  id: string;
  created_at: string;
  updated_at: string;
}

export type FrameworkResponseList = FrameworkResponse[];
