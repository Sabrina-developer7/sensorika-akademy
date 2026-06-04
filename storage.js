// storage.js
// Purpose: merge Students from database.js with any students added at runtime (saved in localStorage)

// Ensure Students is defined (from database.js)
if (typeof Students === 'undefined') {
    window.Students = [];
}

(function mergeStoredStudents(){
    try {
        const base = (window.Students || []).map(s => Object.assign({}, s));

        const added = JSON.parse(localStorage.getItem('addedStudents') || '[]');
        const edited = JSON.parse(localStorage.getItem('editedStudents') || '[]');

        // Start from base students
        let result = base.slice();

        // Apply edits: override existing entries or add if missing
        if (Array.isArray(edited)) {
            edited.forEach(e => {
                const idNum = Number(e.id);
                const idx = result.findIndex(r => Number(r.id) === idNum);
                if (idx >= 0) {
                    // merge with existing to keep any unspecified fields
                    result[idx] = Object.assign({}, result[idx], e);
                } else {
                    result.push(Object.assign({}, e));
                }
            });
        }

        // Normalize added students: ensure unique IDs
        const existingIds = new Set(result.map(s => Number(s.id)));
        let maxId = result.reduce((m, s) => Math.max(m, Number(s.id) || 0), 0);

        const normalizedAdded = (Array.isArray(added) ? added : []).map(s => {
            const copy = Object.assign({}, s);
            if (!copy.id || existingIds.has(Number(copy.id))) {
                maxId += 1;
                copy.id = maxId;
            }
            existingIds.add(Number(copy.id));
            return copy;
        });

        result = result.concat(normalizedAdded);

        window.Students = result;
    } catch (e) {
        console.error('storage.js merge error', e);
    }
})();
