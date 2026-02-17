import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TextVariant } from '../../types/Text';

const variantClasses: Record<TextVariant, string> = {
  'heading-large': 'text-heading-large leading-heading-large font-bold text-heading',
  'heading-medium': 'text-heading-medium leading-heading-medium font-bold text-heading',
  'paragraph-large': 'text-paragraph-large leading-paragraph-large font-normal text-paragraph',
  'paragraph-medium': 'text-paragraph-medium leading-paragraph-medium font-normal text-paragraph',
  'paragraph-small': 'text-paragraph-small leading-paragraph-small font-normal text-span',
  'label-medium': 'text-label-medium leading-label-medium font-semibold text-heading',
  'label-small': 'text-label-small leading-label-small font-semibold text-heading',
  'link': 'text-link leading-link font-semibold text-accent-brand',
};

@Component({
  selector: 'app-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
  },
  template: `<p>{{ text() }}</p>`,
})
export class TextComponent {
  text = input.required<string>();
  variant = input.required<TextVariant>();

  classes = computed(() => variantClasses[this.variant()]);
}
