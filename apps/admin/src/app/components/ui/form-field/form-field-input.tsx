import * as React from 'react';
import { Label } from '../label';
import { cn } from '../utils';
import { InfoHint } from './info-hint';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  description?: string;
  hint?: React.ReactNode;
  hintTitle?: string;
  hintKnowledgeBaseUrl?: string;
  children: React.ReactNode;
  className?: string;
}

function FormField({
  label,
  htmlFor,
  description,
  hint,
  hintTitle,
  hintKnowledgeBaseUrl,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('group/field grid gap-[6px]', className)}>
      <div className='flex items-center gap-1'>
        <Label
          htmlFor={htmlFor}
          className='pl-1 text-xs font-medium text-muted-foreground'
        >
          {label}
        </Label>
        {hint && (
          <span className='opacity-0 group-hover/field:opacity-100 transition-opacity'>
            <InfoHint
              title={hintTitle ?? label}
              knowledgeBaseUrl={hintKnowledgeBaseUrl}
            >
              {hint}
            </InfoHint>
          </span>
        )}
      </div>
      {children}
      {description && (
        <p className='pl-1 text-xs text-muted-foreground'>{description}</p>
      )}
    </div>
  );
}

/** @deprecated Use FormField instead */
const FormFieldInput = FormField;

export { FormField, FormFieldInput };
