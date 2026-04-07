import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styles: [`
    :host { display: block; }

    /* Hero */
    .hero {
      min-height: 100vh;
      background: linear-gradient(135deg, #880e4f 0%, #4a0027 55%, #1a0010 100%);
      display: flex;
      flex-direction: column;
    }

    /* Topbar */
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 2.5rem;
      border-bottom: 1px solid rgba(255,255,255,.1);
    }
    .topbar .brand {
      display: flex;
      align-items: center;
      gap: .75rem;
    }
    .topbar .logo-img {
      width: 48px; height: 48px;
      object-fit: contain;
      border-radius: 50%;
      background: rgba(255,255,255,.12);
      padding: 4px;
    }
    .topbar .brand-name {
      font-size: 1.15rem;
      font-weight: 700;
      color: #fff;
      line-height: 1.1;
    }
    .topbar .brand-sub {
      font-size: .78rem;
      color: rgba(255,255,255,.65);
      font-style: italic;
    }
    .btn-outline-light-custom {
      border: 1.5px solid rgba(255,255,255,.55);
      color: #fff;
      background: transparent;
      border-radius: 999px;
      padding: .4rem 1.2rem;
      font-size: .9rem;
      transition: background .2s, border-color .2s;
      text-decoration: none;
      display: inline-block;
    }
    .btn-outline-light-custom:hover {
      background: rgba(255,255,255,.18);
      border-color: #fff;
      color: #fff;
    }

    /* Contenido hero */
    .hero-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 3rem 1.5rem;
    }
    .hero-flower { font-size: 5rem; margin-bottom: 1rem; animation: float 3s ease-in-out infinite; }
    @keyframes float {
      0%,100% { transform: translateY(0); }
      50%      { transform: translateY(-14px); }
    }
    .hero-title {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 800;
      color: #fff;
      line-height: 1.15;
      margin-bottom: .75rem;
    }
    .hero-title span { color: #f48fb1; }
    .hero-sub {
      font-size: 1.1rem;
      color: rgba(255,255,255,.75);
      max-width: 500px;
      margin: 0 auto 2.5rem;
      line-height: 1.6;
    }
    .btn-primary-custom {
      background: linear-gradient(135deg, #e91e8c, #ad1457);
      color: #fff;
      border: none;
      border-radius: 999px;
      padding: .75rem 2.2rem;
      font-size: 1rem;
      font-weight: 600;
      text-decoration: none;
      display: inline-block;
      box-shadow: 0 4px 20px rgba(233,30,140,.4);
      transition: transform .2s, box-shadow .2s;
      margin-right: .75rem;
    }
    .btn-primary-custom:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(233,30,140,.55);
      color: #fff;
    }
    .btn-ghost-custom {
      background: rgba(255,255,255,.12);
      color: #fff;
      border: 1.5px solid rgba(255,255,255,.35);
      border-radius: 999px;
      padding: .73rem 2.2rem;
      font-size: 1rem;
      font-weight: 600;
      text-decoration: none;
      display: inline-block;
      transition: background .2s, border-color .2s;
    }
    .btn-ghost-custom:hover {
      background: rgba(255,255,255,.22);
      border-color: rgba(255,255,255,.7);
      color: #fff;
    }

    /* Caracteristicas */
    .features {
      background: #fff;
      padding: 4rem 1.5rem;
    }
    .feature-card {
      text-align: center;
      padding: 1.75rem 1rem;
      border-radius: 16px;
      background: #fdf3f8;
      height: 100%;
      transition: transform .2s, box-shadow .2s;
    }
    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(136,14,79,.12);
    }
    .feature-icon { font-size: 2.5rem; margin-bottom: .75rem; }
    .feature-title { font-weight: 700; color: #880e4f; margin-bottom: .4rem; }
    .feature-desc  { font-size: .88rem; color: #666; line-height: 1.5; }

    /* Footer */
    .footer {
      background: #2d0024;
      color: rgba(255,255,255,.6);
      text-align: center;
      padding: 1.25rem;
      font-size: .82rem;
    }
    .footer strong { color: rgba(255,255,255,.85); }

    /* Petals decorativos */
    .petals {
      position: relative;
      overflow: hidden;
    }
    .petal {
      position: absolute;
      font-size: 1.4rem;
      opacity: .18;
      animation: fall linear infinite;
      pointer-events: none;
    }
    @keyframes fall {
      0%   { transform: translateY(-60px) rotate(0deg); opacity:.18; }
      100% { transform: translateY(110vh) rotate(360deg); opacity:0; }
    }
  `],
  template: `
    <div class="hero petals">

      <!-- Pétalos decorativos -->
      <span class="petal" *ngFor="let p of petals"
            [style.left.%]="p.left"
            [style.animation-duration.s]="p.dur"
            [style.animation-delay.s]="p.delay"
            [style.font-size.rem]="p.size">🌸</span>

      <!-- Top bar -->
      <div class="topbar">
        <div class="brand">
          <img src="/Logo.png" alt="Logo" class="logo-img" (error)="onLogoErr($event)">
          <div>
            <div class="brand-name">Atelier Flowers</div>
            <div class="brand-sub">Victoria</div>
          </div>
        </div>
        <a routerLink="/login" class="btn-outline-light-custom">Iniciar Sesión</a>
      </div>

      <!-- Cuerpo hero -->
      <div class="hero-body">
        <div class="hero-flower">🌺</div>
        <h1 class="hero-title">
          La florería con el<br><span>corazón más bonito</span>
        </h1>
        <p class="hero-sub">
          Descubre arreglos únicos y ramos especiales para cada momento.
          Gestionamos tu pedido con amor y dedicación.
        </p>
        <div>
          <a routerLink="/register" class="btn-primary-custom">🌸 Registrarse</a>
          <a routerLink="/login"    class="btn-ghost-custom">Iniciar Sesión</a>
        </div>
      </div>
    </div>

    <!-- Características -->
    <section class="features">
      <div class="container">
        <h2 class="text-center fw-bold mb-1" style="color:#880e4f">¿Por qué elegirnos?</h2>
        <p class="text-center text-muted mb-5">Flores frescas, atención personalizada y entregas a tiempo.</p>

        <div class="row g-4 justify-content-center">
          <div class="col-6 col-md-3">
            <div class="feature-card">
              <div class="feature-icon">🌹</div>
              <div class="feature-title">Flores Frescas</div>
              <div class="feature-desc">Seleccionamos las mejores flores cada día para ti.</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="feature-card">
              <div class="feature-icon">🎁</div>
              <div class="feature-title">Arreglos Únicos</div>
              <div class="feature-desc">Diseños exclusivos hechos con amor y creatividad.</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="feature-card">
              <div class="feature-icon">🚚</div>
              <div class="feature-title">Entrega Rápida</div>
              <div class="feature-desc">Tu pedido llega a tiempo para la ocasión especial.</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="feature-card">
              <div class="feature-icon">💳</div>
              <div class="feature-title">Pago Fácil</div>
              <div class="feature-desc">Efectivo, tarjeta o transferencia sin complicaciones.</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <div class="footer">
      <strong>Atelier Flowers Victoria</strong> &nbsp;|&nbsp;
      Hecho con 🌸 para cada ocasión especial &nbsp;|&nbsp; &#64; 2026
    </div>
  `
})
export class WelcomeComponent {
  petals = Array.from({ length: 12 }, (_, i) => ({
    left:  Math.random() * 100,
    dur:   6 + Math.random() * 8,
    delay: -(Math.random() * 10),
    size:  0.8 + Math.random() * 1
  }));

  onLogoErr(e: Event) {
    (e.target as HTMLImageElement).style.display = 'none';
  }
}
