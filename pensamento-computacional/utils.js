window.PCLabs = window.PCLabs || {};
window.PCUtils = {
  esc: value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
  cells(items, active = -1, visited = []) {
    const e = window.PCUtils.esc;
    return `<div class="array-cells">${items.map((x,i)=>`<div class="array-cell ${i===active?'active':''} ${visited.includes(i)?'done':''}"><span class="cell-index">[${i}]</span><span class="cell-value">${e(x)}</span>${i===active?'<span class="cell-pointer">↑ atual</span>':''}</div>`).join('') || '<span class="empty-state">Lista vazia: não há elementos para visitar.</span>'}</div>`;
  }
};
