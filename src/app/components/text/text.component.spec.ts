import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { TextComponent } from './text.component';
import { TextVariant } from '../../types/Text';

@Component({
  template: `<app-text [text]="text" [variant]="variant" />`,
  imports: [TextComponent],
})
class TestHostComponent {
  text = 'Hello World';
  variant: TextVariant = 'heading-large';
}

describe('TextComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const textEl = fixture.nativeElement.querySelector('app-text');
    expect(textEl).toBeTruthy();
  });

  it('should render the text content', () => {
    const textEl: HTMLElement = fixture.nativeElement.querySelector('app-text');
    expect(textEl.textContent?.trim()).toBe('Hello World');
  });

  it('should apply heading-large classes', () => {
    const textEl: HTMLElement = fixture.nativeElement.querySelector('app-text');
    expect(textEl.classList).toContain('text-heading-large');
    expect(textEl.classList).toContain('font-bold');
    expect(textEl.classList).toContain('text-heading');
  });

  it('should update classes when variant changes', () => {
    host.variant = 'paragraph-medium';
    fixture.detectChanges();

    const textEl: HTMLElement = fixture.nativeElement.querySelector('app-text');
    expect(textEl.classList).toContain('text-paragraph-medium');
    expect(textEl.classList).toContain('font-normal');
    expect(textEl.classList).toContain('text-paragraph');
  });

  it('should apply link variant classes', () => {
    host.variant = 'link';
    fixture.detectChanges();

    const textEl: HTMLElement = fixture.nativeElement.querySelector('app-text');
    expect(textEl.classList).toContain('text-link');
    expect(textEl.classList).toContain('font-semibold');
    expect(textEl.classList).toContain('text-accent-brand');
  });
});
