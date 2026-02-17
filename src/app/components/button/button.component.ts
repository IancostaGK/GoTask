import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ButtonVariant } from '../../types/Button';

const buttonVariants: Record<ButtonVariant, string> = {
  filled: 'text-white bg-accent-brand hover:bg-accent-brand-dark shadow shadow-accent-brand',
  outline: 'text-heading bg-transparent border border-b-border-light hover:border-0 hover:bg-background-dark',
  light: 'text-heading bg-background-surface hover:bg-background-dark',
};

const defaultStyles = 'flex gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all';

@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button [class]="classes()"><ng-content /></button>`,
})
export class ButtonComponent {
  variant = input.required<ButtonVariant>();

  classes = computed(() => `${defaultStyles} ${buttonVariants[this.variant()]}`);
}
