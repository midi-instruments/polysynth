export default function querystringToForm() {
    const search = new URLSearchParams(window.location.search);
    search.forEach((value, key) => {
        const input = document.getElementsByName(key)[0];
        if (!input) {
            return
        }
        if (input.tagName === 'INPUT') {
            if (
                input?.type === 'text' ||
                input?.type === 'search' ||
                input?.type === 'hidden' ||
                input?.type === 'number' ||
                input?.type === 'range'
            ) {
                input.value = value;
            }
            if (input?.type === 'checkbox' || input?.type === 'radio') {
                input.checked = value === 'on';
            }
            input.dispatchEvent(new Event('input', { bubbles: true }));
        } else if (input.tagName === 'SELECT') {
            for (let i=0; i<input.options.length; i++) {
                const option = input.options[i];
                if (option.value === value) {
                    (input as HTMLSelectElement).selectedIndex = i;
                }
            }
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
}
