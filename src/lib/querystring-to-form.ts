export default function querystringToForm() {
    const search = new URLSearchParams(window.location.search);
    search.forEach((value, key) => {
        const input = document.getElementsByName(key)[0];
        if (input) {
            if (input?.type === 'text' || input?.type === 'search' || input?.type === 'hidden' || input?.type === 'number' || input?.type === 'range') {
                input.value = value;
            }
            if (input?.type === 'checkbox' || input?.type === 'radio') {
                input.checked = value === 'on';
            }
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
        const select = document.querySelector(`select[name="${key}"]`);
        if (select) {
            select.value = value;
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
}
