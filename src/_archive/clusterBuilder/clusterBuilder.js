import { LightningElement, track } from 'lwc';
import { navigate } from '../../../router';
import * as Labels from 'data/labels/ClusterBuilder';
import DataViewerModal from 'ui/dataViewerModal';

const STEPS = [
    { id: 1, label: Labels.Step1 },
    { id: 2, label: Labels.Step2 },
    { id: 3, label: Labels.Step3 },
    { id: 4, label: Labels.Step4 },
    { id: 5, label: Labels.Step5 },
];

const ACCOUNT_VARIABLES = [
    { id: 'v1', name: 'Account_ExternalId', type: 'number', min: 1000, max: 99999 },
    { id: 'v2', name: 'Annual Revenue', type: 'number', selected: true, action: 'Replace Missing Values', min: 50000, max: 12500000 },
    { id: 'v5', name: 'Employees', type: 'number', min: 1, max: 250000 },
    { id: 'v6', name: 'Global Discount', type: 'number', min: 0, max: 0.45 },
    { id: 'v7', name: 'Account Currency', type: 'text', frequencies: [
        { label: 'USD', count: 14000 },
        { label: 'EUR', count: 11000 },
        { label: 'GBP', count: 2900 },
        { label: 'JPY', count: 1400 },
        { label: 'CAD', count: 1300 },
        { label: 'AUD', count: 403 },
    ] },
    { id: 'v8', name: 'Account Description', type: 'text', isLargeText: true, avgChars: 2400, selected: true, action: 'Semantic Grouping', frequencies: [
        { label: '< 500 chars', count: 4200 },
        { label: '500–1.5K', count: 7800 },
        { label: '1.5K–3K', count: 6900 },
        { label: '3K–5K', count: 3400 },
        { label: '5K+', count: 1200 },
    ] },
    { id: 'v11', name: 'Account Name', type: 'text', frequencies: [
        { label: 'Starts A–E', count: 6200 },
        { label: 'Starts F–J', count: 5100 },
        { label: 'Starts K–O', count: 4400 },
        { label: 'Starts P–T', count: 5300 },
        { label: 'Starts U–Z', count: 3900 },
    ] },
    { id: 'v13', name: 'Account Source', type: 'text', frequencies: [
        { label: 'Web', count: 9800 },
        { label: 'Phone Inquiry', count: 7200 },
        { label: 'Partner Referral', count: 3100 },
        { label: 'Trade Show', count: 1800 },
        { label: 'Other', count: 950 },
    ] },
    { id: 'v14', name: 'Account Type', type: 'text', frequencies: [
        { label: 'Customer - Direct', count: 12500 },
        { label: 'Customer - Channel', count: 8200 },
        { label: 'Prospect', count: 4400 },
        { label: 'Other', count: 1100 },
    ] },
    { id: 'v16', name: 'Billing Country', type: 'text', frequencies: [
        { label: 'United States', count: 15800 },
        { label: 'United Kingdom', count: 4200 },
        { label: 'Germany', count: 3100 },
        { label: 'France', count: 2400 },
        { label: 'Japan', count: 1700 },
        { label: 'Canada', count: 1200 },
    ] },
    { id: 'v20', name: 'Created Date', type: 'date', selected: true, action: 'Group by Day', min: '1/1/2013, 05:30 AM', max: '1/22/2025, 05:30 AM' },
    { id: 'v21', name: 'Last Activity', type: 'date', selected: true, action: 'Group by Month', min: '4/12/2014, 05:30 AM', max: '6/29/2026, 05:30 AM' },
    { id: 'v22', name: 'Industry', type: 'text', frequencies: [
        { label: 'Technology', count: 8400 },
        { label: 'Financial Services', count: 6200 },
        { label: 'Healthcare', count: 4900 },
        { label: 'Manufacturing', count: 3700 },
        { label: 'Retail', count: 2500 },
        { label: 'Education', count: 1100 },
    ] },
    { id: 'v26', name: 'Support Notes', type: 'text', isLargeText: true, avgChars: 3100, selected: true, action: 'Semantic Grouping', frequencies: [
        { label: '< 500 chars', count: 2100 },
        { label: '500–1.5K', count: 5400 },
        { label: '1.5K–3K', count: 8200 },
        { label: '3K–5K', count: 4600 },
        { label: '5K+', count: 1800 },
    ] },
    { id: 'v27', name: 'Sales Engagement Log', type: 'text', isLargeText: true, avgChars: 1850, frequencies: [
        { label: '< 500 chars', count: 5800 },
        { label: '500–1.5K', count: 6900 },
        { label: '1.5K–3K', count: 4200 },
        { label: '3K–5K', count: 1600 },
        { label: '5K+', count: 420 },
    ] },
];

const DATA_MODEL_OBJECTS = [
    { id: 'dmo-1', label: 'Account', apiName: 'AMR_Account__dlm' },
    { id: 'dmo-2', label: 'Account', apiName: 'AMR_Account_WavePM__dlm' },
    { id: 'dmo-3', label: 'Account Contact', apiName: 'AMR_AccountContact__dlm' },
    { id: 'dmo-4', label: 'Attrition', apiName: 'AMR_Attrition__dlm' },
    { id: 'dmo-5', label: 'Contact Point Address', apiName: 'AMR_ContactPointAddress__dlm' },
    { id: 'dmo-6', label: 'Contact Point Email', apiName: 'AMR_ContactPointEmail__dlm' },
    { id: 'dmo-7', label: 'Contact Point Phone', apiName: 'AMR_ContactPointPhone__dlm' },
    { id: 'dmo-8', label: 'Fiscal Calendar WavePM', apiName: 'AMR_FiscalCalendar_WavePM__dlm' },
    { id: 'dmo-9', label: 'FreemanBDT', apiName: 'FreemanBDT__dlm' },
    { id: 'dmo-10', label: 'Individual', apiName: 'AMR_Individual__dlm' },
    { id: 'dmo-11', label: 'Lead', apiName: 'AMR_Lead__dlm' },
    { id: 'dmo-12', label: 'Lead Engagement Signals', apiName: 'Lead_Engagement_Signals__dlm' },
    { id: 'dmo-13', label: 'Opportunity', apiName: 'AMR_Opportunity__dlm' },
    { id: 'dmo-14', label: 'Case', apiName: 'AMR_Case__dlm' },
];

const VARIANT_STORAGE_KEY = 'cb.variant';
const DEFAULT_VARIANT = 'v4';
const LARGE_TEXT_IDS = ['v8', 'v26', 'v27'];

const VARIANT_PRESETS = {
    v1: {
        selectedVariableIds: new Set(['v8', 'v26']),
        variableActions: { v8: 'Semantic Grouping', v26: 'Semantic Grouping' },
        variableTransformations: { v8: 'semantic-grouping', v26: 'semantic-grouping' },
        autoAppliedSemantic: new Set(['v8', 'v26']),
        pendingRecos: new Set(),
    },
    v2: {
        selectedVariableIds: new Set(),
        variableActions: {},
        variableTransformations: {},
        autoAppliedSemantic: new Set(),
        pendingRecos: new Set(['v8', 'v26']),
    },
    v3: {
        selectedVariableIds: new Set(['v8']),
        variableActions: { v8: 'Semantic Grouping' },
        variableTransformations: { v8: 'semantic-grouping' },
        autoAppliedSemantic: new Set(['v8']),
        pendingRecos: new Set(),
    },
    v4: {
        selectedVariableIds: new Set(['v8', 'v26']),
        variableActions: { v8: 'Semantic Grouping', v26: 'Semantic Grouping' },
        variableTransformations: { v8: 'semantic-grouping', v26: 'semantic-grouping' },
        autoAppliedSemantic: new Set(['v8', 'v26']),
        pendingRecos: new Set(),
        semanticMode: true,
    },
};

export default class ClusterBuilder extends LightningElement {
    labels = Labels;
    @track currentStep = 1;
    @track showLeftPanel = true;
    @track showRightPanel = true;
    @track dmoSearchTerm = '';
    @track showDmoDropdown = false;
    @track selectedDmo = null;
    @track filterSelection = 'all';
    @track variableSearchTerm = '';
    @track showOnlySelected = false;
    @track accountSectionOpen = true;
    @track selectedVariableIds = new Set(['v8', 'v26']);
    @track variableActions = {
        v8: 'Semantic Grouping',
        v26: 'Semantic Grouping',
    };
    @track activeVariableId = null;
    @track variantPickerOpen = false;
    @track variantPickerSearch = '';
    @track variableTransformations = {
        v8: 'semantic-grouping',
        v26: 'semantic-grouping',
    };
    @track autoAppliedSemantic = new Set(['v8', 'v26']);
    @track pendingRecos = new Set();
    @track recoBannerDismissed = false;
    @track variant = DEFAULT_VARIANT;
    @track variableReplaceWith = { v2: 'average' };
    @track variableGroupBy = { v2: 'account-name' };
    @track variableBuckets = {};
    @track selectedAlgorithm = 'kmeans';
    @track autoClusterEnabled = true;
    @track numberOfClusters = 4;
    @track modelName = Labels.ModelNameValue;
    @track clusterDescription = Labels.ClusterDescriptionValue;
    @track activeArticleId = null;
    @track isTraining = false;
    @track isAgentforceOpen = false;

    @track shelfMode = false;
    @track semanticMode = false;
    @track semanticErrorMessage = '';
    _semanticErrorTimer = null;

    connectedCallback() {
        let params = null;
        try {
            const hash = window.location.hash || '';
            const qsMatch = hash.indexOf('?');
            const search = qsMatch >= 0 ? hash.slice(qsMatch) : window.location.search;
            params = new URLSearchParams(search);
        } catch (e) {
            params = null;
        }
        const urlVariant = params && params.get('v');
        const urlStep = params && parseInt(params.get('step'), 10);
        const urlMode = params && params.get('mode');
        this.shelfMode = urlMode === 'shelf';
        this.applyVariantPreset(DEFAULT_VARIANT);
        let targetStep = null;
        if (!isNaN(urlStep) && urlStep >= 1 && urlStep <= 5) {
            targetStep = urlStep;
        } else if (this.shelfMode) {
            targetStep = 3;
        }
        if (targetStep) {
            this.currentStep = targetStep;
            if (targetStep >= 2) {
                this.selectedDmo = DATA_MODEL_OBJECTS.find((d) => d.id === 'dmo-1') || null;
            }
        }
    }

    get shellClass() {
        return this.shelfMode ? 'builder-shell builder-shell_shelf' : 'builder-shell';
    }

    applyVariantPreset(variantId) {
        const preset = VARIANT_PRESETS[variantId] || VARIANT_PRESETS[DEFAULT_VARIANT];
        this.variant = variantId;
        this.selectedVariableIds = new Set(preset.selectedVariableIds);
        this.variableActions = { ...preset.variableActions };
        this.variableTransformations = { ...preset.variableTransformations };
        this.autoAppliedSemantic = new Set(preset.autoAppliedSemantic);
        this.pendingRecos = new Set(preset.pendingRecos);
        this.semanticMode = !!preset.semanticMode;
        this.recoBannerDismissed = false;
        this.activeVariableId = null;
        try {
            window.localStorage.setItem(VARIANT_STORAGE_KEY, variantId);
        } catch (e) {
            // ignore
        }
    }

    get isV1() {
        return this.variant === 'v1';
    }

    get isV2() {
        return this.variant === 'v2';
    }

    get isV3() {
        return this.variant === 'v3';
    }

    get isV4() {
        return this.variant === 'v4';
    }

    get steps() {
        return STEPS.map((step) => {
            const isActive = step.id === this.currentStep;
            const isComplete = step.id < this.currentStep;
            let iconName = 'utility:routing_offline';
            let iconClass = 'step-icon step-icon_pending';
            if (isActive) {
                iconName = 'utility:choice';
                iconClass = 'step-icon step-icon_active';
            }
            return {
                ...step,
                number: step.id,
                isComplete,
                itemClass: `step-item${isActive ? ' step-item_active' : ''}${isComplete ? ' step-item_complete' : ''}`,
                iconName,
                iconClass,
                labelClass: isActive ? 'step-label step-label_active' : 'step-label',
            };
        });
    }

    get isStep1() {
        return this.currentStep === 1;
    }

    get isStep2() {
        return this.currentStep === 2;
    }

    get isStep3() {
        return this.currentStep === 3;
    }

    get isStep4() {
        return this.currentStep === 4;
    }

    get isStep5() {
        return this.currentStep === 5;
    }

    get reviewAlgorithmValue() {
        return this.selectedAlgorithm === 'hdbscan' ? Labels.ReviewAlgorithmValueHDBScan : Labels.ReviewAlgorithmValueKMeans;
    }

    get reviewVariablesInfo() {
        return `${this.selectedCount} of ${this.totalVariableCount} variables selected`;
    }

    get reviewFilterRecords() {
        return this.filterSelection === 'filtered'
            ? '504 of 1000000 records will be used to train the model'
            : '1000000 of 1000000 records will be used to train the model';
    }

    get reviewDmoValue() {
        return this.selectedDmo ? this.selectedDmo.label : 'Account';
    }

    get nextButtonLabel() {
        return this.currentStep === 5 ? Labels.SaveTrainButton : Labels.NextButton;
    }

    get nextButtonIcon() {
        return this.currentStep === 5 ? 'utility:einstein' : null;
    }

    get isFinalStep() {
        return this.currentStep === 5;
    }

    get previousButtonLabel() {
        return this.currentStep === 5 ? Labels.BackButton : Labels.PreviousButton;
    }

    get panelBadgeIcon() {
        return this.currentStep === 5 ? 'utility:fallback' : 'utility:edit';
    }

    get panelBadgeClass() {
        return this.currentStep === 5 ? 'panel-icon-badge panel-icon-badge_train' : 'panel-icon-badge';
    }

    get isKMeansSelected() {
        return this.selectedAlgorithm === 'kmeans';
    }

    get isHdbscanSelected() {
        return this.selectedAlgorithm === 'hdbscan';
    }

    get autoClusterToggleText() {
        return this.autoClusterEnabled ? Labels.AutoClusterEnabled : Labels.AutoClusterDisabled;
    }

    get showNumberOfClusters() {
        return this.selectedAlgorithm === 'kmeans' && !this.autoClusterEnabled;
    }

    get decrementDisabled() {
        return this.numberOfClusters <= 2;
    }

    get incrementDisabled() {
        return this.numberOfClusters >= 10;
    }

    get semanticUsedCount() {
        return Object.values(this.variableTransformations).filter((v) => v === 'semantic-grouping').length;
    }

    get semanticBudgetMax() {
        return Labels.SemanticBudgetMax;
    }

    get semanticBudgetText() {
        return `${Labels.SemanticBudgetLabel}: ${this.semanticUsedCount} of ${this.semanticBudgetMax} used`;
    }

    get semanticBudgetReached() {
        return this.semanticUsedCount >= this.semanticBudgetMax;
    }

    get semanticBudgetBadgeVariant() {
        return this.semanticBudgetReached ? 'warning' : 'inverse';
    }

    get semanticBudgetShortText() {
        return `Semantic transformations · ${this.semanticUsedCount} of ${this.semanticBudgetMax}`;
    }

    // V2 — Recommendation banner (V4 has its own merged banner)
    get showRecoBanner() {
        if (this.recoBannerDismissed || this.pendingRecos.size === 0) return false;
        return this.isV2;
    }

    get recoBannerHeadingText() {
        const count = this.pendingRecos.size;
        return count === 1
            ? 'Einstein has 1 recommendation for you'
            : `Einstein has ${count} recommendations for you`;
    }

    get recoBannerBodyText() {
        return this.isV4 ? Labels.RecoBannerBodyV4 : Labels.RecoBannerBody;
    }

    get recoBannerApplyLabel() {
        return this.isV4 ? Labels.RecoBannerApplyV4 : Labels.RecoBannerApply;
    }

    get showRecoReviewButton() {
        return !this.isV4;
    }

    get recoBannerVariables() {
        return Array.from(this.pendingRecos)
            .map((id) => ACCOUNT_VARIABLES.find((v) => v.id === id))
            .filter(Boolean)
            .map((v) => v.name)
            .join(', ');
    }

    handleRecoApplyAll() {
        if (this.isV4) {
            this.handleSemanticModeToggle({ target: { checked: true } });
            return;
        }
        const trans = { ...this.variableTransformations };
        const actions = { ...this.variableActions };
        const next = new Set(this.selectedVariableIds);
        const auto = new Set(this.autoAppliedSemantic);
        const budget = Labels.SemanticBudgetMax;
        let used = Object.values(trans).filter((t) => t === 'semantic-grouping').length;
        for (const id of this.pendingRecos) {
            if (used >= budget) break;
            trans[id] = 'semantic-grouping';
            actions[id] = Labels.TransformationSemanticGrouping;
            next.add(id);
            auto.add(id);
            used += 1;
        }
        this.variableTransformations = trans;
        this.variableActions = actions;
        this.selectedVariableIds = next;
        this.autoAppliedSemantic = auto;
        this.pendingRecos = new Set();
        this.recoBannerDismissed = true;
    }

    handleRecoDismiss() {
        this.recoBannerDismissed = true;
    }

    handleRecoReviewEach() {
        const firstId = Array.from(this.pendingRecos)[0];
        if (firstId) {
            this.activeVariableId = firstId;
            this.showRightPanel = true;
        }
    }

    // V2 — budget dots
    get semanticBudgetDots() {
        const max = Labels.SemanticBudgetMax;
        const used = this.semanticUsedCount;
        return Array.from({ length: max }, (_, i) => ({
            id: `dot-${i}`,
            dotClass: i < used ? 'budget-dot budget-dot_used' : 'budget-dot',
        }));
    }

    get budgetDotsLabel() {
        return this.semanticBudgetReached
            ? Labels.BudgetDotsLabelFull
            : `${Labels.BudgetDotsLabelAvailable} · ${this.semanticUsedCount}/${Labels.SemanticBudgetMax}`;
    }

    get budgetDotsWrapClass() {
        return this.semanticBudgetReached
            ? 'budget-dots budget-dots_full'
            : 'budget-dots';
    }

    // V3 — compare cards for long-text field in the settings panel
    get showCompareCards() {
        if (!this.isV3) return false;
        const v = this.activeVariable;
        return !!v && v.type === 'text' && !!v.isLargeText;
    }

    get compareTextCardClass() {
        const active = this.activeTransformation === 'text-clustering';
        return active ? 'compare-card compare-card_active' : 'compare-card';
    }

    get compareSemanticCardClass() {
        const active = this.activeTransformation === 'semantic-grouping';
        return active ? 'compare-card compare-card_active compare-card_recommended' : 'compare-card compare-card_recommended';
    }

    get compareTextRadioIconClass() {
        return this.activeTransformation === 'text-clustering'
            ? 'compare-radio compare-radio_active'
            : 'compare-radio';
    }

    get compareSemanticRadioIconClass() {
        return this.activeTransformation === 'semantic-grouping'
            ? 'compare-radio compare-radio_active'
            : 'compare-radio';
    }

    get compareSemanticLocked() {
        return this.semanticBudgetReached && this.activeTransformation !== 'semantic-grouping';
    }

    get compareTextPreview() {
        return [
            { id: 'p1', label: 'billing / invoice / charge', count: '412' },
            { id: 'p2', label: 'password / login / reset', count: '287' },
            { id: 'p3', label: 'refund / cancel', count: '164' },
            { id: 'p4', label: 'other keywords', count: '91' },
        ];
    }

    get compareSemanticPreview() {
        return [
            { id: 'p1', label: 'Billing disputes & unclear charges', count: '498' },
            { id: 'p2', label: 'Account access issues', count: '311' },
            { id: 'p3', label: 'Cancellation intent & churn signals', count: '145' },
        ];
    }

    handleSelectCompareText() {
        this.applyTransformationToActive('text-clustering');
    }

    handleSelectCompareSemantic() {
        if (this.compareSemanticLocked) return;
        this.applyTransformationToActive('semantic-grouping');
    }

    // V4 — Semantic grouping toggle
    get showSemanticModeToggle() {
        return this.isV4;
    }

    get semanticModeToggleBody() {
        return this.semanticMode
            ? Labels.SemanticModeToggleBodyOn
            : Labels.SemanticModeToggleBodyOff;
    }

    get prepareTitleRest() {
        return Labels.PrepareVariablesTitleRest;
    }

    get v4BannerHeading() {
        return Labels.SemanticModeToggleTitle;
    }

    get v4BannerBody() {
        return Labels.SemanticModeToggleBodyOff;
    }

    get v4BannerHelptext() {
        return this.semanticMode
            ? 'Only long text fields can use semantic grouping. Other fields are disabled while it\'s on.'
            : 'Turn on to group long text fields by meaning. Long text fields are disabled while it\'s off.';
    }

    get showV4BannerVars() {
        return !this.semanticMode && this.pendingRecos.size > 0;
    }

    get v4BannerToggleLabel() {
        return this.semanticMode ? 'Semantic grouping on' : 'Turn on semantic grouping';
    }

    get semanticStateLabel() {
        return this.semanticMode ? 'Active' : 'Inactive';
    }

    get semanticStateLabelOn() {
        return 'Active';
    }

    get semanticStateLabelOff() {
        return 'Inactive';
    }

    handleSemanticModeToggle(event) {
        const on = !!event.target.checked;
        this.semanticMode = on;
        if (on) {
            const trans = { ...this.variableTransformations };
            const actions = { ...this.variableActions };
            const selected = new Set(this.selectedVariableIds);
            const auto = new Set(this.autoAppliedSemantic);
            const autoApplyIds = LARGE_TEXT_IDS.slice(0, Labels.SemanticBudgetMax);
            for (const id of autoApplyIds) {
                trans[id] = 'semantic-grouping';
                actions[id] = Labels.TransformationSemanticGrouping;
                selected.add(id);
                auto.add(id);
            }
            for (const id of Object.keys(trans)) {
                if (!autoApplyIds.includes(id)) {
                    delete trans[id];
                    delete actions[id];
                    selected.delete(id);
                    auto.delete(id);
                }
            }
            this.variableTransformations = trans;
            this.variableActions = actions;
            this.selectedVariableIds = selected;
            this.autoAppliedSemantic = auto;
            this.pendingRecos = new Set();
            this.recoBannerDismissed = true;
            const activeIsLargeText = this.activeVariableId
                && (ACCOUNT_VARIABLES.find((v) => v.id === this.activeVariableId) || {}).isLargeText;
            if (!activeIsLargeText) {
                this.activeVariableId = LARGE_TEXT_IDS[0] || null;
            }
        } else {
            const trans = { ...this.variableTransformations };
            const actions = { ...this.variableActions };
            const selected = new Set(this.selectedVariableIds);
            const auto = new Set(this.autoAppliedSemantic);
            for (const id of LARGE_TEXT_IDS) {
                delete trans[id];
                delete actions[id];
                selected.delete(id);
                auto.delete(id);
            }
            this.variableTransformations = trans;
            this.variableActions = actions;
            this.selectedVariableIds = selected;
            this.autoAppliedSemantic = auto;
            if (this.activeVariableId && LARGE_TEXT_IDS.includes(this.activeVariableId)) {
                this.activeVariableId = null;
            }
        }
    }

applyTransformationToActive(value) {
        const id = this.activeVariableId;
        if (!id) return;
        const trans = { ...this.variableTransformations };
        const actions = { ...this.variableActions };
        const next = new Set(this.selectedVariableIds);
        const auto = new Set(this.autoAppliedSemantic);

        if (value === 'semantic-grouping' && trans[id] !== 'semantic-grouping') {
            const used = Object.values(trans).filter((t) => t === 'semantic-grouping').length;
            if (used >= Labels.SemanticBudgetMax) return;
        }

        trans[id] = value;
        if (value === 'text-clustering') actions[id] = Labels.TransformationTextClustering;
        else if (value === 'semantic-grouping') actions[id] = Labels.TransformationSemanticGrouping;
        next.add(id);

        if (value !== 'semantic-grouping') auto.delete(id);

        this.variableTransformations = trans;
        this.variableActions = actions;
        this.selectedVariableIds = next;
        this.autoAppliedSemantic = auto;
    }

    get filteredVariables() {
        const term = this.variableSearchTerm.toLowerCase();
        return ACCOUNT_VARIABLES.filter((v) => {
            if (this.showOnlySelected && !this.selectedVariableIds.has(v.id)) return false;
            if (term && !v.name.toLowerCase().includes(term)) return false;
            return true;
        }).map((v) => {
            const isSelected = this.selectedVariableIds.has(v.id);
            let iconName = 'utility:text';
            if (v.type === 'number') iconName = 'utility:number_input';
            else if (v.type === 'date') iconName = 'utility:event';
            const isAuto = this.autoAppliedSemantic.has(v.id) && this.variableTransformations[v.id] === 'semantic-grouping';
            const action = this.variableActions[v.id] || null;
            const isRecoPending = (this.isV2 || (this.isV4 && !this.semanticMode)) && this.pendingRecos.has(v.id);
            const isRecoApplied = this.isV2 && this.autoAppliedSemantic.has(v.id) && this.variableTransformations[v.id] === 'semantic-grouping';
            const isSemanticBudgetOverflow = this.isV4
                && this.semanticMode
                && !!v.isLargeText
                && this.semanticBudgetReached
                && this.variableTransformations[v.id] !== 'semantic-grouping';
            const v4Locked = this.isV4 && (
                (this.semanticMode && !v.isLargeText) ||
                (!this.semanticMode && v.isLargeText)
                || isSemanticBudgetOverflow
            );
            const showLongTextPill = !!v.isLargeText;
            let v4LockedReason = '';
            let v4LockedTooltip = '';
            if (v4Locked && isSemanticBudgetOverflow) {
                v4LockedReason = Labels.SemanticLockedShort;
                v4LockedTooltip = Labels.SemanticLockedHint;
            }
            const showLargeTextInfo = !!v.isLargeText && !this.isV4;
            return {
                ...v,
                isSelected,
                action,
                actionLabel: action,
                actionVariant: isAuto ? 'brand-outline' : 'neutral',
                iconName,
                showLargeTextInfo,
                rowClass: `${isSelected ? 'var-row var-row_selected' : 'var-row'}${v4Locked ? ' var-row_locked' : ''}`,
                showDelete: v.type !== 'date' && !v4Locked,
                showRecoBadge: isRecoPending,
                showAppliedBadge: isRecoApplied,
                isLocked: v4Locked,
                checkboxId: `var-cb-${v.id}`,
                lockedReason: v4LockedReason,
                lockedTooltip: v4LockedTooltip,
                showLockedTooltip: !!v4LockedTooltip,
                showLongTextPill,
                showActionCell: !v4Locked && !!action,
                showLockText: v4Locked && !!v4LockedReason,
            };
        });
    }

    get showTransformationDropdown() {
        return !this.showCompareCards;
    }

    get selectedCount() {
        return this.selectedVariableIds.size;
    }

    get totalVariableCount() {
        return ACCOUNT_VARIABLES.length;
    }

    get selectedSummary() {
        return `${this.selectedCount} of ${this.totalVariableCount} selected`;
    }

    get accountToggleIcon() {
        return this.accountSectionOpen ? 'utility:chevronup' : 'utility:chevrondown';
    }

    get showOnlySelectedVariant() {
        return this.showOnlySelected ? 'brand' : 'neutral';
    }

    get activeVariable() {
        if (!this.activeVariableId) return null;
        return ACCOUNT_VARIABLES.find((v) => v.id === this.activeVariableId) || null;
    }

    get variantPickerOptions() {
        const term = (this.variantPickerSearch || '').toLowerCase();
        const semanticOn = this.isV4 && this.semanticMode;
        return ACCOUNT_VARIABLES
            .filter((v) => !term || v.name.toLowerCase().includes(term))
            .map((v) => {
                const disabled = semanticOn ? !v.isLargeText : !!v.isLargeText;
                const classes = ['variant-picker-item'];
                if (v.id === this.activeVariableId) classes.push('variant-picker-item_active');
                if (disabled) classes.push('variant-picker-item_disabled');
                return {
                    id: v.id,
                    name: v.name,
                    disabled,
                    itemClass: classes.join(' '),
                };
            });
    }

    get variantPickerButtonLabel() {
        const v = this.activeVariable;
        return v ? v.name : 'Select a variable';
    }

    handleToggleVariantPicker() {
        this.variantPickerOpen = !this.variantPickerOpen;
        if (!this.variantPickerOpen) this.variantPickerSearch = '';
    }

    handleVariantPickerSearch(event) {
        this.variantPickerSearch = event.detail ? event.detail.value : event.target.value;
    }

    handleVariantPickerSelect(event) {
        const id = event.currentTarget.dataset.id;
        if (!id) return;
        if (event.currentTarget.disabled) return;
        this.activeVariableId = id;
        this.variantPickerOpen = false;
        this.variantPickerSearch = '';
    }

    get isVariablePanelOpen() {
        return !!this.activeVariable;
    }

    get activeTransformation() {
        if (!this.activeVariableId) return 'none';
        if (this.variableTransformations[this.activeVariableId]) {
            return this.variableTransformations[this.activeVariableId];
        }
        return 'none';
    }

    get sampleOutcomeTransformation() {
        const t = this.activeTransformation;
        if (t && t !== 'none') return t;
        const v = this.activeVariable;
        if (!v) return 'replace-missing';
        if (v.type === 'text') return 'text-clustering';
        if (v.type === 'date') return 'group-by-day';
        return 'replace-missing';
    }

    get isSemanticGroupingActive() {
        return this.sampleOutcomeTransformation === 'semantic-grouping';
    }

    get semanticBeforeBars() {
        if (!this.isSemanticGroupingActive) return null;
        return [22, 30, 18, 24, 28, 20, 16, 26, 22, 30].map((h, i) => ({
            id: `sgb${i}`,
            height: h * 2.5,
            state: 'normal',
        }));
    }

    get semanticAfterBars() {
        if (!this.isSemanticGroupingActive) return null;
        return [
            { id: 'sga1', height: 78, state: 'normal' },
            { id: 'sga2', height: 60, state: 'normal' },
            { id: 'sga3', height: 46, state: 'normal' },
            { id: 'sga4', height: 34, state: 'normal' },
            { id: 'sga5', height: 22, state: 'normal' },
        ];
    }

    get sampleOutcomeBeforeCaption() {
        const t = this.sampleOutcomeTransformation;
        if (t === 'semantic-grouping') return 'Every response is unique — the model has no signal to learn from.';
        if (t === 'replace-missing') return 'Missing rows are dropped from training, biasing the model toward the majority.';
        return null;
    }

    get sampleOutcomeAfterCaption() {
        const t = this.sampleOutcomeTransformation;
        if (t === 'semantic-grouping') return 'Grouped into semantic themes by an LLM.';
        if (t === 'replace-missing') return 'Missing rows filled with a sensible default.';
        return null;
    }

    get transformationOptions() {
        const v = this.activeVariable;
        if (!v) return [];
        if (v.type === 'text') {
            const currentValue = this.activeTransformation;
            const semanticLocked = this.semanticBudgetReached && currentValue !== 'semantic-grouping';
            const options = [{ label: Labels.TransformationNone, value: 'none' }];
            if (!v.isLargeText) {
                options.push({
                    label: Labels.TransformationTextClustering,
                    value: 'text-clustering',
                });
            } else {
                options.push({
                    label: semanticLocked
                        ? `${Labels.TransformationSemanticGrouping} (Limit reached)`
                        : Labels.TransformationSemanticGrouping,
                    value: 'semantic-grouping',
                    disabled: semanticLocked,
                });
            }
            return options;
        }
        if (v.type === 'date') {
            return [
                { label: Labels.TransformationNone, value: 'none' },
                { label: Labels.TransformationGroupByDay, value: 'group-by-day' },
                { label: Labels.TransformationGroupByMonth, value: 'group-by-month' },
            ];
        }
        return [
            { label: Labels.TransformationNone, value: 'none' },
            { label: Labels.TransformationReplaceMissing, value: 'replace-missing' },
        ];
    }

    get isActiveSemanticLocked() {
        const v = this.activeVariable;
        if (!v || v.type !== 'text' || !v.isLargeText) return false;
        const current = this.activeTransformation;
        return this.semanticBudgetReached && current !== 'semantic-grouping';
    }

    get semanticLockedHint() {
        return Labels.SemanticLockedHint;
    }

    get isActiveVariableNumber() {
        const v = this.activeVariable;
        return !!v && v.type === 'number';
    }

    get isActiveVariableText() {
        const v = this.activeVariable;
        return !!v && v.type === 'text';
    }

    get isActiveVariableDate() {
        const v = this.activeVariable;
        return !!v && v.type === 'date';
    }

    get showNumberBuckets() {
        return this.isActiveVariableNumber;
    }

    get activeBucketCount() {
        if (!this.activeVariableId) return 10;
        return this.variableBuckets[this.activeVariableId] || 10;
    }

    get textFrequencies() {
        const chart = this.textFreqChart;
        return chart ? chart.rows : [];
    }

    get textFreqTicks() {
        const chart = this.textFreqChart;
        return chart ? chart.ticks : [];
    }

    get textFreqChart() {
        const v = this.activeVariable;
        if (!v || v.type !== 'text' || !v.frequencies || !v.frequencies.length) return null;
        const rawMax = Math.max(...v.frequencies.map((f) => f.count));
        const niceMax = this._niceCeiling(rawMax);
        const tickCount = 4;
        const ticks = [];
        for (let i = 0; i <= tickCount; i++) {
            const val = (niceMax / tickCount) * i;
            ticks.push({
                key: `t${i}`,
                label: this.formatCount(val),
                style: `left: ${(i / tickCount) * 100}%`,
            });
        }
        const rows = v.frequencies.map((f) => {
            const pct = niceMax > 0 ? (f.count / niceMax) * 100 : 0;
            const inside = pct >= 28;
            return {
                label: f.label,
                count: this.formatCount(f.count),
                barStyle: `width: ${Math.max(0.5, pct)}%`,
                countCls: inside
                    ? 'var-freq-count var-freq-count_inside'
                    : 'var-freq-count var-freq-count_outside',
            };
        });
        return { ticks, rows };
    }

    _niceCeiling(n) {
        if (!n || n <= 0) return 1;
        const exp = Math.pow(10, Math.floor(Math.log10(n)));
        const frac = n / exp;
        let nice;
        if (frac <= 1) nice = 1;
        else if (frac <= 2) nice = 2;
        else if (frac <= 4) nice = 4;
        else if (frac <= 5) nice = 5;
        else nice = 10;
        return nice * exp;
    }

    get showDistributionSection() {
        return false;
    }

    get showTextFrequencyChart() {
        const v = this.activeVariable;
        return !!v && v.type === 'text' && !!v.frequencies && v.frequencies.length > 0;
    }

    formatCount(n) {
        if (n >= 1000) {
            const k = n / 1000;
            return `${k % 1 === 0 ? k : k.toFixed(1)}K`;
        }
        return String(Math.round(n));
    }

    get replaceWithOptions() {
        return [
            { label: 'Average', value: 'average' },
            { label: 'Median', value: 'median' },
            { label: 'Mode', value: 'mode' },
            { label: 'Maximum', value: 'maximum' },
            { label: 'Minimum', value: 'minimum' },
        ];
    }

    get groupByOptions() {
        return [
            { label: 'Account Name', value: 'account-name' },
            { label: 'Industry', value: 'industry' },
            { label: 'Account Type', value: 'account-type' },
            { label: 'Billing Country', value: 'billing-country' },
        ];
    }

    get activeReplaceWith() {
        if (!this.activeVariableId) return 'average';
        return this.variableReplaceWith[this.activeVariableId] || 'average';
    }

    get activeGroupBy() {
        if (!this.activeVariableId) return 'account-name';
        return this.variableGroupBy[this.activeVariableId] || 'account-name';
    }

    get showReplaceMissingOptions() {
        return this.activeTransformation === 'replace-missing';
    }

    get showDistribution() {
        const v = this.activeVariable;
        return !!v && (v.type === 'number' || v.type === 'date');
    }

    get distributionMin() {
        const v = this.activeVariable;
        return v && v.min !== undefined ? v.min : '';
    }

    get distributionMax() {
        const v = this.activeVariable;
        return v && v.max !== undefined ? v.max : '';
    }

    get showPrevious() {
        return this.currentStep > 1;
    }

    get isNextDisabled() {
        if (this.currentStep === 1) {
            return !this.selectedDmo;
        }
        return false;
    }

    get showRightPanelContent() {
        return this.showRightPanel && !this.isAgentforceOpen;
    }

    get isAllRecordsSelected() {
        return this.filterSelection === 'all';
    }

    get isFilteredRecordsSelected() {
        return this.filterSelection === 'filtered';
    }


    get panelTitle() {
        if (this.currentStep === 5) return Labels.Panel5Title;
        if (this.currentStep === 4) return Labels.Panel4Title;
        if (this.currentStep === 3) return Labels.Panel3Title;
        if (this.currentStep === 2) return Labels.Panel2Title;
        return Labels.PanelTitle;
    }

    get panelHeadline() {
        if (this.currentStep === 5) return Labels.Panel5Headline;
        if (this.currentStep === 4) return Labels.Panel4Headline;
        if (this.currentStep === 3) return Labels.Panel3Headline;
        if (this.currentStep === 2) return Labels.Panel2Headline;
        return Labels.PanelHeadline;
    }

    get panelBody() {
        if (this.currentStep === 5) {
            return [
                { id: 'b1', text: Labels.Panel5Body1 },
                { id: 'b2', text: Labels.Panel5Body2 },
                { id: 'b3', text: Labels.Panel5Body3 },
                { id: 'b4', text: Labels.Panel5Body4 },
            ];
        }
        if (this.currentStep === 4) return [{ id: 'b1', text: Labels.Panel4Body1 }];
        if (this.currentStep === 3) return [{ id: 'b1', text: Labels.Panel3Body1 }];
        if (this.currentStep === 2) return [{ id: 'b1', text: Labels.Panel2Body1 }];
        return [
            { id: 'b1', text: Labels.PanelBody1 },
            { id: 'b2', text: Labels.PanelBody2 },
            { id: 'b3', text: Labels.PanelBody3 },
        ];
    }

    get panelCards() {
        if (this.currentStep === 5) return [];
        if (this.currentStep === 4) {
            return [
                { id: 'c1', title: Labels.Panel4Card1Title, articleId: 'choosing-an-algorithm' },
            ];
        }
        if (this.currentStep === 3) {
            return [
                { id: 'c1', title: Labels.Panel3Card1Title, articleId: 'which-variables-to-include' },
                { id: 'c2', title: Labels.Panel3Card2Title, articleId: 'choosing-variables-manually' },
                { id: 'c3', title: Labels.Panel3Card3Title, articleId: 'refine-variable-selection' },
            ];
        }
        if (this.currentStep === 2) {
            return [
                { id: 'c1', title: Labels.Panel2Card1Title, articleId: 'why-filtering-matters' },
                { id: 'c2', title: Labels.Panel2Card2Title, articleId: 'what-should-i-filter' },
            ];
        }
        return [
            { id: 'c1', title: Labels.Card1Title, articleId: 'clustering-vs-multiclass' },
            { id: 'c2', title: Labels.Card2Title, articleId: 'prepare-data-for-clustering' },
        ];
    }

    get dataSpaceOptions() {
        return [
            { label: 'AMER', value: 'AMER' },
            { label: 'default', value: 'default', description: 'Default data space where all the current DLOs are made members' },
        ];
    }

    get dataObjectTypeOptions() {
        return [
            { label: 'Data Model Object', value: 'dmo' },
            { label: 'Calculated Insights', value: 'calculated-insights' },
        ];
    }

    get filteredDmoItems() {
        const term = this.dmoSearchTerm.toLowerCase();
        return DATA_MODEL_OBJECTS.filter(
            (item) => !term || item.label.toLowerCase().includes(term) || item.apiName.toLowerCase().includes(term)
        );
    }

    get dmoSearchValue() {
        return this.selectedDmo ? `${this.selectedDmo.label} (${this.selectedDmo.apiName})` : this.dmoSearchTerm;
    }

    handleDmoSearchFocus() {
        this.showDmoDropdown = true;
    }

    handleDmoSearchInput(event) {
        this.dmoSearchTerm = event.target.value;
        this.selectedDmo = null;
        this.showDmoDropdown = true;
    }

    handleDmoSelect(event) {
        const id = event.currentTarget.dataset.id;
        this.selectedDmo = DATA_MODEL_OBJECTS.find((item) => item.id === id);
        this.dmoSearchTerm = '';
        this.showDmoDropdown = false;
    }

    handleDmoSearchBlur() {
        // Delay to allow click on list item
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            this.showDmoDropdown = false;
        }, 200);
    }

    handleSelectAllRecords() {
        this.filterSelection = 'all';
    }

    handleSelectFilteredRecords() {
        this.filterSelection = 'filtered';
    }

    handleVariableSearch(event) {
        this.variableSearchTerm = event.target.value;
    }

    handleToggleShowOnlySelected() {
        this.showOnlySelected = !this.showOnlySelected;
    }

    handleToggleAccountSection() {
        this.accountSectionOpen = !this.accountSectionOpen;
    }

    handleVariableToggle(event) {
        const id = event.currentTarget.dataset.id;
        if (this.isVariableLockedV4(id)) {
            event.target.checked = this.selectedVariableIds.has(id);
            return;
        }
        const v = ACCOUNT_VARIABLES.find((x) => x.id === id);
        const isSemanticLargeText = this.isV4 && this.semanticMode && !!v && v.isLargeText;
        const next = new Set(this.selectedVariableIds);
        const actions = { ...this.variableActions };
        const trans = { ...this.variableTransformations };
        const auto = new Set(this.autoAppliedSemantic);
        if (next.has(id)) {
            next.delete(id);
            delete actions[id];
            if (isSemanticLargeText) {
                delete trans[id];
                auto.delete(id);
            }
        } else {
            next.add(id);
            if (isSemanticLargeText) {
                trans[id] = 'semantic-grouping';
                actions[id] = Labels.TransformationSemanticGrouping;
            }
        }
        this.selectedVariableIds = next;
        this.variableActions = actions;
        this.variableTransformations = trans;
        this.autoAppliedSemantic = auto;
    }

    isVariableLockedV4(id) {
        if (!this.isV4) return false;
        const v = ACCOUNT_VARIABLES.find((x) => x.id === id);
        if (!v) return false;
        if (this.semanticMode && !v.isLargeText) return true;
        if (!this.semanticMode && v.isLargeText) return true;
        if (this.semanticMode && v.isLargeText
            && this.semanticBudgetReached
            && this.variableTransformations[id] !== 'semantic-grouping') return true;
        return false;
    }

    handleRemoveVariable(event) {
        event.stopPropagation();
        const id = event.currentTarget.dataset.id;
        const next = new Set(this.selectedVariableIds);
        next.delete(id);
        this.selectedVariableIds = next;
        const actions = { ...this.variableActions };
        delete actions[id];
        this.variableActions = actions;
        const trans = { ...this.variableTransformations };
        delete trans[id];
        this.variableTransformations = trans;
        const auto = new Set(this.autoAppliedSemantic);
        auto.delete(id);
        this.autoAppliedSemantic = auto;
        if (this.activeVariableId === id) {
            this.activeVariableId = null;
        }
    }

    handleVariableNameClick(event) {
        event.preventDefault();
        const id = event.currentTarget.dataset.id;
        if (this.isVariableLockedV4(id)) return;
        this.activeVariableId = id;
        this.showRightPanel = true;
    }

    handleCloseVariablePanel() {
        this.activeVariableId = null;
        this._clearSemanticError();
    }

    _showSemanticError(message) {
        this.semanticErrorMessage = message;
        if (this._semanticErrorTimer) {
            clearTimeout(this._semanticErrorTimer);
        }
        this._semanticErrorTimer = setTimeout(() => {
            this.semanticErrorMessage = '';
            this._semanticErrorTimer = null;
        }, 6000);
    }

    _clearSemanticError() {
        if (this.semanticErrorMessage) {
            this.semanticErrorMessage = '';
        }
        if (this._semanticErrorTimer) {
            clearTimeout(this._semanticErrorTimer);
            this._semanticErrorTimer = null;
        }
    }

    handleDismissSemanticError() {
        this._clearSemanticError();
    }

    get hasSemanticError() {
        return !!this.semanticErrorMessage;
    }

    get semanticErrorTitle() {
        return Labels.SemanticBudgetErrorTitle;
    }

    handleTransformationChange(event) {
        const id = this.activeVariableId;
        if (!id) return;
        const value = event.detail.value;
        const trans = { ...this.variableTransformations };
        const actions = { ...this.variableActions };
        const next = new Set(this.selectedVariableIds);
        const auto = new Set(this.autoAppliedSemantic);
        const prevValue = trans[id];

        if (value === 'semantic-grouping' && prevValue !== 'semantic-grouping') {
            const used = Object.values(trans).filter((t) => t === 'semantic-grouping').length;
            if (used >= Labels.SemanticBudgetMax) {
                this._showSemanticError(Labels.SemanticBudgetErrorMessage);
                return;
            }
        }
        this._clearSemanticError();

        if (value === 'none') {
            delete trans[id];
            delete actions[id];
            next.delete(id);
        } else {
            trans[id] = value;
            if (value === 'replace-missing') actions[id] = Labels.TransformationReplaceMissing;
            else if (value === 'text-clustering') actions[id] = Labels.TransformationTextClustering;
            else if (value === 'semantic-grouping') actions[id] = Labels.TransformationSemanticGrouping;
            else if (value === 'group-by-month') actions[id] = Labels.TransformationGroupByMonth;
            else if (value === 'group-by-day') actions[id] = Labels.TransformationGroupByDay;
            next.add(id);
        }

        if (value !== 'semantic-grouping') {
            auto.delete(id);
        }

        this.variableTransformations = trans;
        this.variableActions = actions;
        this.selectedVariableIds = next;
        this.autoAppliedSemantic = auto;
    }

    handleReplaceWithChange(event) {
        const id = this.activeVariableId;
        if (!id) return;
        this.variableReplaceWith = { ...this.variableReplaceWith, [id]: event.detail.value };
    }

    handleGroupByChange(event) {
        const id = this.activeVariableId;
        if (!id) return;
        this.variableGroupBy = { ...this.variableGroupBy, [id]: event.detail.value };
    }

    handleBucketChange(event) {
        const id = this.activeVariableId;
        if (!id) return;
        this.variableBuckets = { ...this.variableBuckets, [id]: parseInt(event.target.value, 10) };
    }

    handleSelectKMeans() {
        this.selectedAlgorithm = 'kmeans';
    }

    handleSelectHdbscan() {
        this.selectedAlgorithm = 'hdbscan';
    }

    handleToggleAutoCluster(event) {
        this.autoClusterEnabled = event.target.checked;
    }

    handleClusterCountChange(event) {
        const val = parseInt(event.target.value, 10);
        if (!isNaN(val) && val >= 2 && val <= 10) {
            this.numberOfClusters = val;
        }
    }

    handleClusterDecrement() {
        if (this.numberOfClusters > 2) {
            this.numberOfClusters -= 1;
        }
    }

    handleClusterIncrement() {
        if (this.numberOfClusters < 10) {
            this.numberOfClusters += 1;
        }
    }

    handleModelNameChange(event) {
        this.modelName = event.target.value;
    }

    handleClusterDescriptionChange(event) {
        this.clusterDescription = event.target.value;
    }

    handleSaveTrain() {
        this.isTraining = true;
    }

    handleCancelTraining() {
        this.isTraining = false;
    }

    handleEditStep(event) {
        const step = parseInt(event.currentTarget.dataset.step, 10);
        if (step && step >= 1 && step <= 5) {
            this.currentStep = step;
        }
    }

    handleNext() {
        if (this.shelfMode) return;
        if (this.currentStep < 5) {
            this.currentStep += 1;
            this.activeArticleId = null;
        }
    }

    handlePrevious() {
        if (this.shelfMode) return;
        if (this.currentStep > 1) {
            this.currentStep -= 1;
            this.activeArticleId = null;
        }
    }

    handleStepClick(event) {
        if (this.shelfMode) return;
        const step = parseInt(event.currentTarget.dataset.step, 10);
        if (step && step >= 1 && step <= 5) {
            this.currentStep = step;
            this.activeArticleId = null;
        }
    }

    handleOpenArticle(event) {
        event.preventDefault();
        const articleId = event.currentTarget.dataset.article;
        if (articleId && Labels.ARTICLES[articleId]) {
            this.activeArticleId = articleId;
        }
    }

    handleCloseArticle() {
        this.activeArticleId = null;
    }

    get isArticleOpen() {
        return !!this.activeArticleId;
    }

    get activeArticle() {
        if (!this.activeArticleId) return null;
        const article = Labels.ARTICLES[this.activeArticleId];
        if (!article) return null;
        return {
            title: article.title,
            blocks: article.blocks.map((block, idx) => {
                const id = `blk-${idx}`;
                if (block.type === 'p') {
                    return { id, isParagraph: true, text: block.text };
                }
                if (block.type === 'h') {
                    return { id, isHeading: true, text: block.text };
                }
                if (block.type === 'ul') {
                    return {
                        id,
                        isUnorderedList: true,
                        items: block.items.map((it, i) => ({
                            id: `${id}-i${i}`,
                            strong: it.strong || '',
                            hasStrong: !!it.strong,
                            text: it.text,
                        })),
                    };
                }
                if (block.type === 'ol') {
                    return {
                        id,
                        isOrderedList: true,
                        items: block.items.map((it, i) => ({
                            id: `${id}-i${i}`,
                            strong: it.strong || '',
                            hasStrong: !!it.strong,
                            text: it.text,
                        })),
                    };
                }
                return { id, isParagraph: true, text: '' };
            }),
        };
    }

    handleToggleLeft() {
        if (this.shelfMode) return;
        this.showLeftPanel = !this.showLeftPanel;
    }

    handleToggleRight() {
        if (this.shelfMode) return;
        this.showRightPanel = !this.showRightPanel;
    }

    async handleViewData() {
        await DataViewerModal.open({ size: 'large' });
    }

    handleBack() {
        if (this.shelfMode) return;
        navigate('/app/aim-cluster');
    }

    get variantSwitchV1Class() {
        return 'nav-variant-switch__btn nav-variant-switch__btn_active';
    }

    get variantSwitchV2Class() {
        return 'nav-variant-switch__btn';
    }

    get variantSwitchV3Class() {
        return 'nav-variant-switch__btn';
    }

    get variantSwitchV4Class() {
        return 'nav-variant-switch__btn';
    }

    get isV1AriaSelected() {
        return 'true';
    }

    get isV2AriaSelected() {
        return 'false';
    }

    get isV3AriaSelected() {
        return 'false';
    }

    get isV4AriaSelected() {
        return 'false';
    }

    handleVariantSwitch(event) {
        const target = event.currentTarget.dataset.variant;
        if (target === 'v1') return;
        const params = new URLSearchParams();
        if (this.currentStep) params.set('step', String(this.currentStep));
        if (this.shelfMode) params.set('mode', 'shelf');
        const qs = params.toString();
        let suffix = 'builder-v2';
        if (target === 'v3') suffix = 'builder-v3';
        else if (target === 'v4') suffix = 'builder-v4';
        navigate(qs ? `/app/aim-cluster/${suffix}?${qs}` : `/app/aim-cluster/${suffix}`);
    }

    handleToggleAgentforce() {
        if (this.shelfMode) return;
        this.isAgentforceOpen = !this.isAgentforceOpen;
    }

    handleCloseAgentforce() {
        this.isAgentforceOpen = false;
    }
}
