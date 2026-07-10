# ui-sample-outcome

Side-by-side BEFORE/AFTER mini bar charts for a variable transformation preview,
plus an optional "Risk if you skip this transformation" strip.

## Copy to another project

Copy this folder (`sampleOutcome/`) into `src/modules/ui/` of the target
project. It uses `lightning-icon` (for the warning glyph) and nothing else.

## Preset mode

```html
<ui-sample-outcome transformation="replace-missing"></ui-sample-outcome>
```

Valid `transformation` values: `replace-missing`, `group-by-day`,
`group-by-month`, `text-clustering`.

Set `hide-risk` to hide the risk strip:

```html
<ui-sample-outcome transformation="replace-missing" hide-risk></ui-sample-outcome>
```

## Custom mode

```html
<ui-sample-outcome
    title="Preview"
    subtitle="How the model will see it"
    before-bars={myBefore}
    after-bars={myAfter}
    before-caption="18% of rows missing a value"
    after-caption="Filled with average per industry"
    risk-text="Skipping drops 18% of rows from training."
></ui-sample-outcome>
```

Each bar: `{ id, height, state }` where `state` is
`'normal' | 'missing' | 'filled'`. `height` is a 0–100 percentage of the
chart height.

## Notes

- Uses SLDS brand tokens for the default bar color with hex fallbacks.
- `state: 'missing'` renders a hatched dashed bar (absent value).
- `state: 'filled'` renders a solid green bar (imputed / newly-present value).
