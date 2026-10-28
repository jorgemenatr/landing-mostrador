// mostrador_ — interacciones del sitio. Sin dependencias.
// Las conversaciones y catálogos son ejemplos ilustrativos: nada aquí se conecta a un servicio real.

(function () {
  'use strict';

  function readJSON(id) {
    var el = document.getElementById(id);
    if (!el) return null;
    try { return JSON.parse(el.textContent); } catch (e) { return null; }
  }

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function bindTabs(group, onPick) {
    var buttons = group.querySelectorAll('button[data-key]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        onPick(btn.getAttribute('data-key'));
      });
    });
  }

  // ── Inicio: demostración por giro ─────────────────────
  function initHomeDemo() {
    var data = readJSON('demo-data');
    var tabs = document.querySelector('[data-demo-tabs]');
    if (!data || !tabs) return;
    var tienda = document.querySelector('[data-demo="tienda"]');
    var rows = document.querySelector('[data-demo="rows"]');
    var msgs = document.querySelector('[data-demo="msgs"]');
    var nota = document.querySelector('[data-demo="nota"]');

    function render(key) {
      var esc = data[key];
      if (!esc) return;
      tienda.textContent = esc.tienda;
      nota.textContent = esc.nota;

      rows.replaceChildren.apply(rows, esc.rows.map(function (r) {
        var row = el('div', r.used ? 'mw-tbl__row mw-tbl__row--used' : 'mw-tbl__row');
        var info = el('div');
        info.appendChild(el('div', 'ms-table__name', r.n));
        info.appendChild(el('div', 'ms-table__sub', r.d));
        if (r.used) info.appendChild(el('div', 'mw-used', 'bot> usó estos datos'));
        var price = el('div', 'mw-tbl__num', r.p);
        var stock = el('div', 'mw-tbl__num', r.s);
        stock.appendChild(el('small', null, r.sn));
        row.append(info, price, stock);
        return row;
      }));

      msgs.replaceChildren.apply(msgs, esc.msgs.map(function (m, i) {
        var bot = m.k === 'b';
        var msg = el('div', (bot ? 'ms-msg ms-msg--ours ms-msg--bot' : 'ms-msg') + ' mw-pop mw-d' + (i + 1));
        msg.appendChild(el('div', 'ms-msg__bubble', m.t));
        var meta = el('span', 'ms-msg__meta');
        if (bot) { meta.appendChild(el('b', null, 'bot')); meta.append(' · ' + m.h); }
        else { meta.textContent = m.h; }
        msg.appendChild(meta);
        return msg;
      }));
    }

    bindTabs(tabs, render);
  }

  // ── Casos de uso: pregunta, datos y respuesta ────────
  function initCasos() {
    var data = readJSON('casos-data');
    var tabs = document.querySelector('[data-casos-tabs]');
    if (!data || !tabs) return;
    var q = document.querySelector('[data-caso="q"]');
    var a = document.querySelector('[data-caso="a"]');
    var list = document.querySelector('[data-caso="data"]');
    var noteWrap = document.querySelector('[data-caso="note-wrap"]');
    var note = document.querySelector('[data-caso="note"]');
    var dtStyle = list.querySelector('dt') ? list.querySelector('dt').getAttribute('style') : '';
    var ddStyle = list.querySelector('dd') ? list.querySelector('dd').getAttribute('style') : '';

    function render(key) {
      var c = data[key];
      if (!c) return;
      q.textContent = c.q;
      a.textContent = c.a;
      list.replaceChildren.apply(list, c.data.map(function (d) {
        var item = el('div');
        var dt = el('dt', null, d.k);
        var dd = el('dd', null, d.v);
        dt.setAttribute('style', dtStyle);
        dd.setAttribute('style', ddStyle);
        item.append(dt, dd);
        return item;
      }));
      if (noteWrap) {
        noteWrap.hidden = !c.note;
        note.textContent = c.note || '';
      }
    }

    bindTabs(tabs, render);
    render(tabs.querySelector('[aria-pressed="true"]').getAttribute('data-key'));
  }

  // ── Demo: formulario ──────────────────────────────────
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate(values) {
    var errs = {};
    if (!values.nombre.trim()) errs.nombre = 'Escribe tu nombre.';
    if (!values.negocio.trim()) errs.negocio = 'Escribe el nombre de tu negocio.';
    var c = values.contacto.trim();
    if (!c) errs.contacto = 'Déjanos un correo o un WhatsApp.';
    else if (c.indexOf('@') >= 0) { if (!EMAIL.test(c)) errs.contacto = 'Revisa el correo: falta algo.'; }
    else if (c.replace(/\D/g, '').length < 10) errs.contacto = 'El número debe tener al menos 10 dígitos.';
    return errs;
  }

  function initDemoForm() {
    var form = document.querySelector('[data-demo-form]');
    if (!form) return;
    var formView = document.querySelector('[data-demo-form-view]');
    var success = document.querySelector('[data-demo-success]');
    var errorBox = document.querySelector('[data-form-error]');
    var errorText = document.querySelector('[data-form-error-text]');
    var defaultError = errorText.textContent;
    var submit = form.querySelector('button[type="submit"]');
    var fields = ['nombre', 'negocio', 'contacto'];

    function setError(name, msg) {
      var input = form.elements[name];
      var out = document.getElementById('e-' + name);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      out.textContent = msg || '';
      out.hidden = !msg;
    }

    fields.forEach(function (name) {
      form.elements[name].addEventListener('input', function () { setError(name, ''); });
    });

    function showFailure(msg) {
      errorText.textContent = msg || defaultError;
      errorBox.hidden = false;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      errorBox.hidden = true;
      var values = {
        nombre: form.elements.nombre.value,
        negocio: form.elements.negocio.value,
        contacto: form.elements.contacto.value,
        giro: form.elements.giro.value,
      };
      var errs = validate(values);
      fields.forEach(function (name) { setError(name, errs[name]); });
      var firstBad = fields.filter(function (n) { return errs[n]; })[0];
      if (firstBad) { form.elements[firstBad].focus(); return; }

      var endpoint = form.getAttribute('data-endpoint');
      if (!endpoint) {
        // Sin integración configurada: no se envía ni se guarda nada.
        showFailure();
        return;
      }

      submit.disabled = true;
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        formView.hidden = true;
        success.hidden = false;
        success.setAttribute('tabindex', '-1');
        success.focus();
      }).catch(function () {
        showFailure('No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo.');
      }).then(function () {
        submit.disabled = false;
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHomeDemo();
    initCasos();
    initDemoForm();
  });
})();
