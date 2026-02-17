import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TextVariant } from '../../types/Text';

const variantClasses: Record<TextVariant, string> = {
  'heading-large': 'text-heading-large leading-heading-large font-bold',
  'heading-medium': 'text-heading-medium leading-heading-medium font-bold',
  'paragraph-large': 'text-paragraph-large leading-paragraph-large font-normal',
  'paragraph-medium': 'text-paragraph-medium leading-paragraph-medium font-normal',
  'paragraph-small': 'text-paragraph-small leading-paragraph-small font-normal',
  'label-medium': 'text-label-medium leading-label-medium font-semibold',
  'label-small': 'text-label-small leading-label-small font-semibold',
  'link': 'text-link leading-link font-semibold',
};

@Component({
  selector: 'app-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
  },
  template: `<ng-content />`,
})
export class TextComponent {
  variant = input.required<TextVariant>();

  classes = computed(() => variantClasses[this.variant()]);
}
