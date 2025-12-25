import { TemplateId } from '../config/schema';
import { ClassicTemplate } from './classic';
import { MinimalTemplate } from './minimal';
import { CreativeTemplate } from './creative';
import { CertificateTemplateProps } from './base';

export type TemplateComponent = React.FC<CertificateTemplateProps>;

export const templateRegistry: Record<TemplateId, TemplateComponent> = {
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
};

export const getTemplate = (templateId: TemplateId): TemplateComponent => {
  const template = templateRegistry[templateId];
  if (!template) {
    console.warn(`Template "${templateId}" not found, falling back to classic`);
    return ClassicTemplate;
  }
  return template;
};

export { ClassicTemplate, MinimalTemplate, CreativeTemplate };
export type { CertificateTemplateProps };
