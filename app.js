// ═══════════════════════════════════════
// ADMIN PASSWORD — Change this to your own
const ADMIN_PASSWORD = 'bhuwan2025';
// ═══════════════════════════════════════

let isAdmin = false;

function getData() {
  const stored = localStorage.getItem('bwb_data');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.version) return parsed;
    } catch (e) { /* fall through */ }
  }
  return SITE_DATA;
}

function saveData(data) {
  localStorage.setItem('bwb_data', JSON.stringify(data));
  renderAll();
}

function resetData() {
  localStorage.removeItem('bwb_data');
  renderAll();
  showToast('Reset to published data');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// ─── RENDERING ───

function renderAll() {
  const data = getData();
  renderFeatured(data);
  renderProjects(data);
  renderCerts(data);
  if (isAdmin) {
    renderAdminProjects(data);
    renderAdminCerts(data);
  }
  initScrollReveal();
}

function renderFeatured(data) {
  const container = document.getElementById('featured-project');
  const feat = data.projects.find(p => p.featured);
  if (!feat) { container.innerHTML = ''; return; }

  const tags = feat.tags.map(t => `<span class="tag">${escHtml(t)}</span>`).join('');
  const story = feat.description.map(p => `<p>${escHtml(p)}</p>`).join('');

  container.innerHTML = `
    <div class="featured-wrap reveal">
      <a href="${escHtml(feat.url)}" target="_blank" rel="noopener" class="featured-card">
        <div class="featured-inner">
          ${feat.badge ? `<div class="featured-badge">${escHtml(feat.badge)}</div>` : ''}
          <div class="featured-icon">${feat.icon}</div>
          <div class="featured-name">${escHtml(feat.name)}</div>
          <div class="featured-tagline">${escHtml(feat.tagline)}</div>
          <div class="featured-story">${story}</div>
          <div class="featured-bottom">
            <div class="featured-tags">${tags}</div>
            <span class="featured-link">
              ${escHtml(feat.linkText || 'View')}
              <span class="featured-link-arrow">↗</span>
            </span>
          </div>
        </div>
      </a>
    </div>`;
}

function renderProjects(data) {
  const container = document.getElementById('projects-grid');
  const nonFeatured = data.projects.filter(p => !p.featured);

  container.innerHTML = nonFeatured.map(p => {
    const tags = p.tags.map(t => `<span class="tag">${escHtml(t)}</span>`).join('');
    const desc = p.description.join(' ');
    return `
      <a href="${escHtml(p.url)}" target="_blank" rel="noopener" class="project-card reveal">
        <div class="project-icon">${p.icon}</div>
        <div class="project-name">${escHtml(p.name)}</div>
        <div class="project-tagline">${escHtml(p.tagline)}</div>
        <p class="project-desc">${escHtml(desc)}</p>
        <div class="project-tags">${tags}</div>
        <div class="project-footer">
          <span class="project-footer-text">${escHtml(p.linkText || 'View')}</span>
          <span class="project-arrow">↗</span>
        </div>
      </a>`;
  }).join('');
}

function renderCerts(data) {
  const container = document.getElementById('certs-grid');
  const creds = data.credentials || {};

  container.innerHTML = data.certifications.map(c => {
    const issuerLower = c.issuer.toLowerCase();
    const dotClass = issuerLower.includes('udemy') ? 'udemy' : 'coursera';
    const letter = c.issuer.charAt(0).toUpperCase();
    const hasCred = !!creds[c.id];

    return `
      <div class="cert-card reveal" data-cert-id="${c.id}">
        <div class="cert-issuer">
          <span class="cert-issuer-dot ${dotClass}">${letter}</span>
          ${escHtml(c.issuer)}
        </div>
        <div class="cert-name">${escHtml(c.name)}</div>
        <div class="cert-date">Issued ${escHtml(c.date)}</div>
        <div class="cert-actions">
          <button class="cert-view-btn${hasCred ? ' has-cred' : ''}" onclick="viewCredential('${c.id}', '${escHtml(c.name).replace(/'/g, "\\'")}')">
            ${hasCred ? 'View Credential' : 'View Credential'}
          </button>
        </div>
      </div>`;
  }).join('');
}

// ─── CREDENTIAL VIEWER ───

function viewCredential(certId, certName) {
  const data = getData();
  const cred = (data.credentials || {})[certId];
  const body = document.getElementById('credBody');
  document.getElementById('credTitle').textContent = certName;

  if (cred && cred.data) {
    if (cred.type && cred.type.startsWith('image/')) {
      body.innerHTML = `<img src="${cred.data}" alt="${escHtml(certName)}" />`;
    } else if (cred.type === 'application/pdf') {
      body.innerHTML = `<iframe src="${cred.data}"></iframe>`;
    } else {
      body.innerHTML = '<div class="cred-empty"><p>Unsupported format</p></div>';
    }
  } else {
    body.innerHTML = `<div class="cred-empty">
      <p>No credential document uploaded yet.</p>
      ${isAdmin ? '<p>Use the admin panel to upload one.</p>' : ''}
    </div>`;
  }

  document.getElementById('credBackdrop').classList.add('active');
}

// ─── AUTH & ADMIN ───

function showAuth() {
  if (isAdmin) {
    openAdminPanel();
    return;
  }
  document.getElementById('authBackdrop').classList.add('active');
  const inp = document.getElementById('authInput');
  inp.value = '';
  document.getElementById('authError').classList.remove('show');
  setTimeout(() => inp.focus(), 100);
}

function authenticate() {
  if (document.getElementById('authInput').value === ADMIN_PASSWORD) {
    isAdmin = true;
    document.getElementById('authBackdrop').classList.remove('active');
    openAdminPanel();
    showToast('Admin access granted');
  } else {
    document.getElementById('authError').classList.add('show');
    document.getElementById('authInput').value = '';
    document.getElementById('authInput').focus();
  }
}

function openAdminPanel() {
  const data = getData();
  renderAdminProjects(data);
  renderAdminCerts(data);
  document.getElementById('adminBackdrop').classList.add('active');
  document.getElementById('adminPanel').classList.add('open');
}

function closeAdminPanel() {
  document.getElementById('adminBackdrop').classList.remove('active');
  document.getElementById('adminPanel').classList.remove('open');
}

// ─── ADMIN: Projects Tab ───

function renderAdminProjects(data) {
  const pane = document.getElementById('pane-projects');
  const items = data.projects.map(p => `
    <div class="admin-item">
      <span class="admin-item-name">${escHtml(p.name)}</span>
      <div class="admin-item-actions">
        <button class="admin-item-btn edit" onclick="editProject('${p.id}')">Edit</button>
        <button class="admin-item-btn del" onclick="deleteProject('${p.id}')">Del</button>
      </div>
    </div>`).join('');

  pane.innerHTML = `
    <div class="admin-section-title">All Projects</div>
    ${items}
    <button class="admin-add-btn" onclick="addProjectForm()">+ Add New Project</button>`;
}

function addProjectForm() {
  showEditModal('Add Project', [
    { key: 'name', label: 'Name', type: 'text', value: '' },
    { key: 'tagline', label: 'Tagline', type: 'text', value: '' },
    { key: 'description', label: 'Description (one paragraph per line)', type: 'textarea', value: '' },
    { key: 'tags', label: 'Tags (comma separated)', type: 'text', value: '' },
    { key: 'url', label: 'Link URL', type: 'text', value: '' },
    { key: 'icon', label: 'Icon (emoji)', type: 'text', value: '🚀' },
    { key: 'linkText', label: 'Link Text', type: 'text', value: 'View' },
    { key: 'featured', label: 'Featured (yes/no)', type: 'text', value: 'no' },
    { key: 'badge', label: 'Badge Text (optional)', type: 'text', value: '' },
  ], function(vals) {
    const data = getData();
    if (!localStorage.getItem('bwb_data')) {
      localStorage.setItem('bwb_data', JSON.stringify(data));
    }
    const d = JSON.parse(localStorage.getItem('bwb_data'));
    d.projects.push({
      id: 'proj-' + Date.now(),
      name: vals.name,
      tagline: vals.tagline,
      description: vals.description.split('\n').filter(Boolean),
      tags: vals.tags.split(',').map(t => t.trim()).filter(Boolean),
      url: vals.url,
      icon: vals.icon || '🚀',
      linkText: vals.linkText || 'View',
      featured: vals.featured.toLowerCase() === 'yes',
      badge: vals.badge || '',
    });
    saveData(d);
    renderAdminProjects(d);
    showToast('Project added');
  });
}

function editProject(id) {
  const data = getData();
  const p = data.projects.find(x => x.id === id);
  if (!p) return;

  showEditModal('Edit Project', [
    { key: 'name', label: 'Name', type: 'text', value: p.name },
    { key: 'tagline', label: 'Tagline', type: 'text', value: p.tagline },
    { key: 'description', label: 'Description (one paragraph per line)', type: 'textarea', value: p.description.join('\n') },
    { key: 'tags', label: 'Tags (comma separated)', type: 'text', value: p.tags.join(', ') },
    { key: 'url', label: 'Link URL', type: 'text', value: p.url },
    { key: 'icon', label: 'Icon (emoji)', type: 'text', value: p.icon },
    { key: 'linkText', label: 'Link Text', type: 'text', value: p.linkText || 'View' },
    { key: 'featured', label: 'Featured (yes/no)', type: 'text', value: p.featured ? 'yes' : 'no' },
    { key: 'badge', label: 'Badge Text (optional)', type: 'text', value: p.badge || '' },
  ], function(vals) {
    if (!localStorage.getItem('bwb_data')) {
      localStorage.setItem('bwb_data', JSON.stringify(data));
    }
    const d = JSON.parse(localStorage.getItem('bwb_data'));
    const idx = d.projects.findIndex(x => x.id === id);
    if (idx === -1) return;
    d.projects[idx] = {
      ...d.projects[idx],
      name: vals.name,
      tagline: vals.tagline,
      description: vals.description.split('\n').filter(Boolean),
      tags: vals.tags.split(',').map(t => t.trim()).filter(Boolean),
      url: vals.url,
      icon: vals.icon,
      linkText: vals.linkText,
      featured: vals.featured.toLowerCase() === 'yes',
      badge: vals.badge || '',
    };
    saveData(d);
    renderAdminProjects(d);
    showToast('Project updated');
  });
}

function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  const data = getData();
  if (!localStorage.getItem('bwb_data')) {
    localStorage.setItem('bwb_data', JSON.stringify(data));
  }
  const d = JSON.parse(localStorage.getItem('bwb_data'));
  d.projects = d.projects.filter(p => p.id !== id);
  saveData(d);
  renderAdminProjects(d);
  showToast('Project deleted');
}

// ─── ADMIN: Certs Tab ───

function renderAdminCerts(data) {
  const pane = document.getElementById('pane-certs');
  const creds = data.credentials || {};

  const items = data.certifications.map(c => {
    const hasCred = !!creds[c.id];
    return `
    <div class="admin-item">
      <span class="admin-item-name">${escHtml(c.name)}</span>
      <div class="admin-item-actions">
        <label class="admin-item-btn upload" title="Upload credential">
          ${hasCred ? '✓' : '↑'}
          <input type="file" accept="image/*,.pdf" onchange="uploadCredential(event, '${c.id}')" />
        </label>
        <button class="admin-item-btn edit" onclick="editCert('${c.id}')">Edit</button>
        <button class="admin-item-btn del" onclick="deleteCert('${c.id}')">Del</button>
      </div>
    </div>`;
  }).join('');

  pane.innerHTML = `
    <div class="admin-section-title">All Certifications</div>
    ${items}
    <button class="admin-add-btn" onclick="addCertForm()">+ Add New Certification</button>`;
}

function addCertForm() {
  showEditModal('Add Certification', [
    { key: 'name', label: 'Certification Name', type: 'text', value: '' },
    { key: 'issuer', label: 'Issuer (Coursera, Udemy, etc.)', type: 'text', value: '' },
    { key: 'date', label: 'Date Issued (e.g. August 2024)', type: 'text', value: '' },
    { key: 'file', label: 'Credential Document', type: 'file', value: '' },
  ], function(vals) {
    const data = getData();
    if (!localStorage.getItem('bwb_data')) {
      localStorage.setItem('bwb_data', JSON.stringify(data));
    }
    const d = JSON.parse(localStorage.getItem('bwb_data'));
    const certId = 'cert-' + Date.now();
    d.certifications.push({
      id: certId,
      name: vals.name,
      issuer: vals.issuer,
      date: vals.date,
    });
    if (vals._fileData) {
      if (!d.credentials) d.credentials = {};
      d.credentials[certId] = vals._fileData;
    }
    saveData(d);
    renderAdminCerts(d);
    showToast('Certification added');
  });
}

function editCert(id) {
  const data = getData();
  const c = data.certifications.find(x => x.id === id);
  if (!c) return;

  showEditModal('Edit Certification', [
    { key: 'name', label: 'Certification Name', type: 'text', value: c.name },
    { key: 'issuer', label: 'Issuer', type: 'text', value: c.issuer },
    { key: 'date', label: 'Date Issued', type: 'text', value: c.date },
  ], function(vals) {
    if (!localStorage.getItem('bwb_data')) {
      localStorage.setItem('bwb_data', JSON.stringify(data));
    }
    const d = JSON.parse(localStorage.getItem('bwb_data'));
    const idx = d.certifications.findIndex(x => x.id === id);
    if (idx === -1) return;
    d.certifications[idx] = { ...d.certifications[idx], name: vals.name, issuer: vals.issuer, date: vals.date };
    saveData(d);
    renderAdminCerts(d);
    showToast('Certification updated');
  });
}

function deleteCert(id) {
  if (!confirm('Delete this certification?')) return;
  const data = getData();
  if (!localStorage.getItem('bwb_data')) {
    localStorage.setItem('bwb_data', JSON.stringify(data));
  }
  const d = JSON.parse(localStorage.getItem('bwb_data'));
  d.certifications = d.certifications.filter(c => c.id !== id);
  if (d.credentials) delete d.credentials[id];
  saveData(d);
  renderAdminCerts(d);
  showToast('Certification deleted');
}

function uploadCredential(e, certId) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 4 * 1024 * 1024) {
    showToast('File too large (max 4MB)');
    return;
  }
  const reader = new FileReader();
  reader.onload = function(ev) {
    const data = getData();
    if (!localStorage.getItem('bwb_data')) {
      localStorage.setItem('bwb_data', JSON.stringify(data));
    }
    const d = JSON.parse(localStorage.getItem('bwb_data'));
    if (!d.credentials) d.credentials = {};
    d.credentials[certId] = { data: ev.target.result, type: file.type, name: file.name };
    saveData(d);
    renderAdminCerts(d);
    showToast('Credential uploaded');
  };
  reader.readAsDataURL(file);
}

// ─── EDIT MODAL ───

let editModalFileData = null;

function showEditModal(title, fields, onSave) {
  document.getElementById('editModalTitle').textContent = title;
  const form = document.getElementById('editForm');
  editModalFileData = null;

  form.innerHTML = fields.map(f => {
    if (f.type === 'textarea') {
      return `<div class="form-group">
        <label class="form-label">${f.label}</label>
        <textarea class="form-textarea" data-key="${f.key}">${escHtml(f.value)}</textarea>
      </div>`;
    }
    if (f.type === 'file') {
      return `<div class="form-group">
        <label class="form-label">${f.label}</label>
        <div class="form-file-area">
          <input type="file" accept="image/*,.pdf" onchange="handleEditFile(event)" />
          <div class="form-file-label">Drop file or <strong>browse</strong></div>
          <div class="form-file-name" id="editFileName"></div>
        </div>
      </div>`;
    }
    return `<div class="form-group">
      <label class="form-label">${f.label}</label>
      <input class="form-input" type="text" data-key="${f.key}" value="${escHtml(f.value)}" />
    </div>`;
  }).join('') + '<button type="submit" class="form-submit">Save</button>';

  form.onsubmit = function(e) {
    e.preventDefault();
    const vals = {};
    form.querySelectorAll('[data-key]').forEach(el => {
      vals[el.dataset.key] = el.value;
    });
    if (editModalFileData) vals._fileData = editModalFileData;
    onSave(vals);
    document.getElementById('editBackdrop').classList.remove('active');
  };

  document.getElementById('editBackdrop').classList.add('active');
  const firstInput = form.querySelector('input, textarea');
  if (firstInput) setTimeout(() => firstInput.focus(), 100);
}

function handleEditFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 4 * 1024 * 1024) {
    showToast('File too large (max 4MB)');
    e.target.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = function(ev) {
    editModalFileData = { data: ev.target.result, type: file.type, name: file.name };
    const nameEl = document.getElementById('editFileName');
    if (nameEl) nameEl.textContent = file.name;
  };
  reader.readAsDataURL(file);
}

// ─── PUBLISH ───

function publishChanges() {
  const data = getData();
  const content = 'const SITE_DATA = ' + JSON.stringify(data, null, 2) + ';\n';
  document.getElementById('publishContent').value = content;
  document.getElementById('publishBackdrop').classList.add('active');
}

function copyPublishContent() {
  const textarea = document.getElementById('publishContent');
  textarea.select();
  navigator.clipboard.writeText(textarea.value).then(() => {
    showToast('Copied to clipboard. Replace your data.js and commit.');
  }).catch(() => {
    document.execCommand('copy');
    showToast('Copied. Replace your data.js and commit.');
  });
}

// ─── TABS ───

function switchAdminTab(tabName) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-tab-pane').forEach(t => t.classList.remove('active'));
  document.querySelector(`.admin-tab[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById('pane-' + tabName).classList.add('active');
}

// ─── SCROLL ───

function initScrollReveal() {
  const els = document.querySelectorAll('.reveal:not(.visible)');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => observer.observe(el));
}

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  document.getElementById('scrollProgress').style.width = progress + '%';
}

function updateNavState() {
  const nav = document.getElementById('nav');
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

// ─── EVENT LISTENERS ───

document.addEventListener('DOMContentLoaded', function() {
  renderAll();

  // Auth
  document.getElementById('adminTrigger').addEventListener('click', showAuth);
  document.getElementById('authSubmit').addEventListener('click', authenticate);
  document.getElementById('authInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') authenticate();
  });
  document.getElementById('authBackdrop').addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('active');
  });

  // Admin panel
  document.getElementById('adminClose').addEventListener('click', closeAdminPanel);
  document.getElementById('adminBackdrop').addEventListener('click', closeAdminPanel);

  // Admin tabs
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => switchAdminTab(tab.dataset.tab));
  });

  // Publish / Reset
  document.getElementById('publishBtn').addEventListener('click', publishChanges);
  document.getElementById('resetBtn').addEventListener('click', function() {
    if (confirm('Reset all changes to the published version?')) resetData();
  });

  // Edit modal close
  document.getElementById('editClose').addEventListener('click', function() {
    document.getElementById('editBackdrop').classList.remove('active');
  });
  document.getElementById('editBackdrop').addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('active');
  });

  // Credential viewer close
  document.getElementById('credClose').addEventListener('click', function() {
    document.getElementById('credBackdrop').classList.remove('active');
  });
  document.getElementById('credBackdrop').addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('active');
  });

  // Publish modal
  document.getElementById('publishClose').addEventListener('click', function() {
    document.getElementById('publishBackdrop').classList.remove('active');
  });
  document.getElementById('publishBackdrop').addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('active');
  });
  document.getElementById('copyBtn').addEventListener('click', copyPublishContent);

  // Keyboard
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
      e.preventDefault();
      showAuth();
    }
    if (e.key === 'Escape') {
      document.getElementById('authBackdrop').classList.remove('active');
      document.getElementById('editBackdrop').classList.remove('active');
      document.getElementById('credBackdrop').classList.remove('active');
      document.getElementById('publishBackdrop').classList.remove('active');
      closeAdminPanel();
    }
  });

  // Scroll
  window.addEventListener('scroll', function() {
    updateScrollProgress();
    updateNavState();
  }, { passive: true });

  updateScrollProgress();
  updateNavState();
});
