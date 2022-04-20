import {alwatrRegisteredList, createLogger} from '@alwatr/logger';
import {LitElement, html, css} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';

import {getSvgContent} from './requests';
import {getUrl} from './utils';

import type {TemplateResult, PropertyValues} from 'lit';

alwatrRegisteredList.push({
  name: '@alwatr/icon',
  version: '{{ALWATR_VERSION}}',
});

@customElement('alwatr-icon')
export class AlWatrIcon extends LitElement {
  @state() private svgContent?: string;

  @property({reflect: true}) name!: string;
  @property() size?: 'sm' | 'lg';

  @query('div.icon-inner') private _iconInner!: HTMLDivElement;

  private _logger = createLogger('alwatr/icon');

  static override styles = [
    css`
      :host {
        display: inline-block;

        width: 1em;
        height: 1em;

        contain: strict;

        fill: currentColor;

        box-sizing: content-box !important;
      }

      .icon-inner,
      svg {
        display: block;

        height: 100%;
        width: 100%;
      }

      :host([size='sm']) {
        font-size: 18px !important;
      }

      :host([size='lg']) {
        font-size: 32px !important;
      }
    `,
  ];

  protected override render(): TemplateResult {
    return html`<div class="icon-inner"></div> `;
  }

  protected override update(changedProperties: PropertyValues): void {
    if (changedProperties.has('name')) {
      this._logger.logProperty('name', this.name);
      this.loadIcon();
    }

    super.update(changedProperties);
  }

  protected override updated(): void {
    this._iconInner.innerHTML = this.svgContent ?? '';
  }

  protected loadIcon(): void {
    const url = getUrl(this);

    getSvgContent(url).then((svgContent) => {
      this.svgContent = svgContent;
    });
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.loadIcon();
  }
}
