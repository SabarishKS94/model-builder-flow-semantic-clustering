import { LightningElement, api } from 'lwc';

/**
 * <ui-sample-outcome>
 *
 * Side-by-side BEFORE/AFTER mini bar charts for a variable transformation preview,
 * plus an optional "Risk if you skip this transformation" strip.
 *
 * Two ways to drive the content:
 *
 * 1. Preset mode — pass a `transformation` string and let the component build its
 *    own sample bars + captions + risk copy:
 *        <ui-sample-outcome transformation="replace-missing"></ui-sample-outcome>
 *    Valid values: "replace-missing" | "group-by-day" | "group-by-month" | "text-clustering"
 *
 * 2. Custom mode — pass your own bar arrays and text. Each bar is
 *    `{ id, height, state }` where `state` is 'normal' | 'missing' | 'filled'.
 *        <ui-sample-outcome
 *            before-bars={myBefore}
 *            after-bars={myAfter}
 *            before-caption="18% of rows missing a value"
 *            after-caption="Filled with average per industry"
 *            risk-text="Skipping drops 18% of rows from training."
 *        ></ui-sample-outcome>
 *
 * Set `hide-risk` to suppress the risk strip in preset mode.
 */
export default class SampleOutcome extends LightningElement {
    @api title = 'Sample outcome';
    @api subtitle = 'How the model will see this variable after training.';

    // Preset mode
    @api transformation = '';
    @api hideRisk = false;

    // Custom mode overrides
    @api beforeBars;
    @api afterBars;
    @api beforeCaption;
    @api afterCaption;
    @api riskText;

    // --- Preset datasets ---
    _presetBefore(t) {
        switch (t) {
            case 'replace-missing':
                return [
                    { id: 'rb1', height: 45, state: 'normal' },
                    { id: 'rb2', height: 72, state: 'normal' },
                    { id: 'rb3', height: 60, state: 'missing' },
                    { id: 'rb4', height: 55, state: 'normal' },
                    { id: 'rb5', height: 82, state: 'normal' },
                    { id: 'rb6', height: 60, state: 'missing' },
                    { id: 'rb7', height: 68, state: 'normal' },
                    { id: 'rb8', height: 40, state: 'normal' },
                ];
            case 'group-by-day':
            case 'group-by-month':
                return [12, 8, 22, 6, 30, 14, 4, 18, 10, 26, 8, 20].map((h, i) => ({
                    id: `db${i}`,
                    height: h * 3,
                    state: 'normal',
                }));
            case 'text-clustering':
                return [22, 30, 18, 24, 28, 20, 16, 26, 22, 30].map((h, i) => ({
                    id: `tb${i}`,
                    height: h * 2.5,
                    state: 'normal',
                }));
            default:
                return [];
        }
    }

    _presetAfter(t) {
        switch (t) {
            case 'replace-missing':
                return [
                    { id: 'ra1', height: 45, state: 'normal' },
                    { id: 'ra2', height: 72, state: 'normal' },
                    { id: 'ra3', height: 60, state: 'filled' },
                    { id: 'ra4', height: 55, state: 'normal' },
                    { id: 'ra5', height: 82, state: 'normal' },
                    { id: 'ra6', height: 60, state: 'filled' },
                    { id: 'ra7', height: 68, state: 'normal' },
                    { id: 'ra8', height: 40, state: 'normal' },
                ];
            case 'group-by-day':
                return [45, 60, 82, 55, 70, 25, 20].map((h, i) => ({
                    id: `da${i}`,
                    height: h,
                    state: 'normal',
                }));
            case 'group-by-month':
                return [40, 55, 72, 88, 62, 45].map((h, i) => ({
                    id: `ma${i}`,
                    height: h,
                    state: 'normal',
                }));
            case 'text-clustering':
                return [64, 48, 36, 28, 24].map((h, i) => ({
                    id: `ta${i}`,
                    height: h,
                    state: 'normal',
                }));
            default:
                return [];
        }
    }

    _presetBeforeCaption(t) {
        switch (t) {
            case 'replace-missing': return '18% of rows missing a value';
            case 'group-by-day': return 'Raw dates — thousands of unique values';
            case 'group-by-month': return 'Raw dates — thousands of unique values';
            case 'text-clustering': return 'Free-text — every response unique';
            default: return '';
        }
    }

    _presetAfterCaption(t) {
        switch (t) {
            case 'replace-missing': return 'Filled with average per industry';
            case 'group-by-day': return 'Grouped by day';
            case 'group-by-month': return 'Grouped by month';
            case 'text-clustering': return 'Clustered into 5 categories';
            default: return '';
        }
    }

    _presetRisk(t) {
        switch (t) {
            case 'replace-missing':
                return 'Skipping drops 18% of rows from training and can bias the model toward the majority segment.';
            case 'group-by-day':
            case 'group-by-month':
                return 'Skipping keeps thousands of unique dates — the model treats each day as its own category and overfits.';
            case 'text-clustering':
                return 'Skipping keeps every free-text response unique — the model has no signal to learn from.';
            default:
                return '';
        }
    }

    _decorate(bars) {
        return (bars || []).map((b) => {
            const state = b.state || 'normal';
            const cls = state === 'missing'
                ? 'g-bar g-bar_missing'
                : state === 'filled'
                    ? 'g-bar g-bar_filled'
                    : 'g-bar';
            return {
                id: b.id,
                cls,
                style: `height: ${b.height}%`,
            };
        });
    }

    get resolvedBefore() {
        const raw = this.beforeBars && this.beforeBars.length
            ? this.beforeBars
            : this._presetBefore(this.transformation);
        return this._decorate(raw);
    }

    get resolvedAfter() {
        const raw = this.afterBars && this.afterBars.length
            ? this.afterBars
            : this._presetAfter(this.transformation);
        return this._decorate(raw);
    }

    get resolvedBeforeCaption() {
        return this.beforeCaption != null && this.beforeCaption !== ''
            ? this.beforeCaption
            : this._presetBeforeCaption(this.transformation);
    }

    get resolvedAfterCaption() {
        return this.afterCaption != null && this.afterCaption !== ''
            ? this.afterCaption
            : this._presetAfterCaption(this.transformation);
    }

    get resolvedRisk() {
        if (this.hideRisk) return '';
        return this.riskText != null && this.riskText !== ''
            ? this.riskText
            : this._presetRisk(this.transformation);
    }

    get hasRisk() {
        return !!this.resolvedRisk;
    }
}
