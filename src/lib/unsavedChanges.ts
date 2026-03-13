let _hasUnsavedChanges = false;

export const setUnsavedChanges = (value: boolean) => {
    _hasUnsavedChanges = value;
};

export const hasUnsavedChanges = () => _hasUnsavedChanges;
