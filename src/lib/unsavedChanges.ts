let _hasUnsavedChanges = false;

// Sets global unsaved-change flag used by navigation guards.
export const setUnsavedChanges = (value: boolean) => {
    _hasUnsavedChanges = value;
};

// Reads current global unsaved-change flag.
export const hasUnsavedChanges = () => _hasUnsavedChanges;
