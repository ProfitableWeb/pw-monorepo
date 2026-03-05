import * as React from 'react';
import { Label } from '../label';
import { cn } from '../utils';
import { InfoHint } from './info-hint';

interface FormFieldInputProps {
  label: string;
  htmlFor?: string;
  description?: string;
  hint?: React.ReactNode;
  hintTitle?: string;
  hintKnowledgeBaseUrl?: string;
  children: React.ReactNode;
  className?: string;
}

function FormFieldInput({
  label,
  htmlFor,
  description,
  hint,
  hintTitle,
  hintKnowledgeBaseUrl,
  children,
  className,
}: FormFieldInputProps) {
  return (
    <div className={cn('grid gap-[6px]', className)}>
      <div className='flex items-center gap-1'>
        <Label
          htmlFor={htmlFor}
          className='pl-1 text-xs font-medium text-muted-foreground'
        >
          {label}
        </Label>
        {hint && (
          <InfoHint
            title={hintTitle ?? label}
            knowledgeBaseUrl={hintKnowledgeBaseUrl}
          >
            {hint}
          </InfoHint>
        )}
      </div>
      {children}
      {description && (
        <p className='pl-1 text-xs text-muted-foreground'>{description}</p>
      )}
    </div>
  );
}

export { FormFieldInput };
