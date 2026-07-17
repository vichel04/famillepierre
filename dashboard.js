class Dashboard {
  constructor(supabaseClient, tableName = 'membres') {
    this.supabase = supabaseClient;
    this.tableName = tableName;
    this.members = [];
    this.charts = {};
  }

  async load() {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      this._showError(error.message);
      return false;
    }

    this.members = data || [];
    return true;
  }

  isEmpty() {
    return this.members.length === 0;
  }

  getKPIs() {
    return {
      total: this.members.length,
      hommes: this.members.filter(m => m.sexe === 'Masculin').length,
      femmes: this.members.filter(m => m.sexe === 'Féminin').length,
      maries: this.members.filter(m => m.situation_matrimoniale === 'Marié(e)').length
    };
  }

  countBy(field) {
    const counts = {};
    this.members.forEach(m => {
      const key = m[field] || 'Non renseigné';
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }

  renderKPIs(containerEl) {
    const k = this.getKPIs();
    containerEl.innerHTML = `
      <div class="kpi"><strong>${k.total}</strong><span>Total membres</span></div>
      <div class="kpi"><strong>${k.hommes}</strong><span>Hommes</span></div>
      <div class="kpi"><strong>${k.femmes}</strong><span>Femmes</span></div>
      <div class="kpi"><strong>${k.maries}</strong><span>Mariés</span></div>
    `;
  }

  renderCharts(campusCanvas, sexeCanvas) {
    const campusCounts = this.countBy('campus');
    this.charts.campus = new Chart(campusCanvas, {
      type: 'bar',
      data: {
        labels: Object.keys(campusCounts),
        datasets: [{ data: Object.values(campusCounts), backgroundColor: '#6B21A8', borderRadius: 6 }]
      },
      options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    });

    const sexeCounts = this.countBy('sexe');
    this.charts.sexe = new Chart(sexeCanvas, {
      type: 'doughnut',
      data: {
        labels: Object.keys(sexeCounts),
        datasets: [{ data: Object.values(sexeCounts), backgroundColor: ['#6B21A8', '#16A34A', '#E4E0EF'] }]
      },
      options: { plugins: { legend: { position: 'bottom' } } }
    });
  }

  search(query) {
    const q = query.toLowerCase();
    return this.members.filter(m =>
      Object.values(m).some(v => String(v || '').toLowerCase().includes(q))
    );
  }

  renderTable(tbodyEl, query = '') {
    const rows = this.search(query);
    tbodyEl.innerHTML = rows.map(m => `
      <tr>
        <td>${m.created_at ? new Date(m.created_at).toLocaleDateString('fr-FR') : ''}</td>
        <td>${m.nom || ''}</td>
        <td>${m.prenom || ''}</td>
        <td>${m.sexe || ''}</td>
        <td>${m.telephone || ''}</td>
        <td>${m.ville || ''}</td>
        <td>${m.campus || ''}</td>
        <td>${m.ministere || ''}</td>
        <td>${m.situation_matrimoniale || ''}</td>
      </tr>
    `).join('');
  }

  exportCSV() {
    if (this.members.length === 0) return;
    const headers = Object.keys(this.members[0]);
    const rows = this.members.map(m =>
      headers.map(h => `"${String(m[h] ?? '').replace(/"/g, '""')}"`).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'membres_famille_pierre_' + new Date().toISOString().slice(0, 10) + '.csv';
    a.click();
  }

  _showError(msg) {
    console.error('Dashboard error:', msg);
  }
}