import { useState } from 'react';
import { ArrowRight, Bot, Check, ChevronDown, Code2, ExternalLink, Globe2, Menu, MessageCircle, Rocket, ShieldCheck, Smartphone, Sparkles, X } from 'lucide-react';
import { ConsultationModal } from './components/ConsultationModal';
import { ReviewSection } from './components/ReviewSection';
import { faqs, pains, profile, programs } from './data/content';
import type { ConsultationType } from './types';

function App() {
  const [modal, setModal] = useState<{ open: boolean; type: ConsultationType }>({ open: false, type: 'free' });
  const [menuOpen, setMenuOpen] = useState(false);
  const openModal = (type: ConsultationType) => setModal({ open: true, type });

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top"><span className="brand-mark"><Code2 size={18} /></span>{profile.brand}</a>
        <nav className={menuOpen ? 'nav open' : 'nav'}>
          <a href="#programs" onClick={() => setMenuOpen(false)}>과정</a>
          <a href="#process" onClick={() => setMenuOpen(false)}>진행 방식</a>
          <a href="#instructor" onClick={() => setMenuOpen(false)}>강사 소개</a>
          <a href="#reviews" onClick={() => setMenuOpen(false)}>수강후기</a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          <button className="button compact" onClick={() => openModal('free')}>무료 상담</button>
        </nav>
        <button className="mobile-menu" onClick={() => setMenuOpen((v) => !v)} aria-label="메뉴">{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <main id="top">
        <section className="hero section">
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles size={15} /> AI를 도구로, 결과물은 실제 서비스로</span>
            <h1>{profile.headline}</h1>
            <p className="hero-subtitle">{profile.subheadline}</p>
            <div className="hero-actions">
              <button className="button primary" onClick={() => openModal('free')}>15분 무료상담 <ArrowRight size={18} /></button>
              <button className="button secondary" onClick={() => openModal('paid')}>프로젝트 진단 신청</button>
            </div>
            <div className="trust-row">{profile.experience.map((item) => <span key={item}><Check size={15} />{item}</span>)}</div>
          </div>
          <div className="hero-visual" aria-label="웹과 앱 MVP 제작 과정">
            <div className="visual-window">
              <div className="window-bar"><i/><i/><i/></div>
              <div className="visual-flow">
                <div className="flow-card"><MessageCircle /><span>아이디어</span></div><ArrowRight />
                <div className="flow-card"><Bot /><span>AI 구현</span></div><ArrowRight />
                <div className="flow-card accent"><ShieldCheck /><span>개발자 검증</span></div><ArrowRight />
                <div className="flow-card"><Rocket /><span>배포·제출</span></div>
              </div>
              <div className="visual-result"><Globe2/><div><strong>웹 또는 iPhone 앱</strong><span>핵심 기능이 실제로 작동하는 MVP</span></div></div>
            </div>
          </div>
        </section>

        <section className="section muted-section">
          <div className="section-heading"><span className="eyebrow">이런 상황인가요?</span><h2>코드는 생겼지만 프로젝트는 앞으로 나가지 않을 때</h2></div>
          <div className="pain-grid">{pains.map(([title, text]) => <article className="pain-card" key={title}><span>{title}</span><p>{text}</p></article>)}</div>
        </section>

        <section className="section">
          <div className="section-heading"><span className="eyebrow">AI만으로 부족한 이유</span><h2>생성보다 중요한 것은 판단과 완성입니다.</h2><p>AI 사용법을 따로 외우는 수업이 아닙니다. 실제 프로젝트 안에서 요구사항을 나누고, 코드를 검증하고, 배포 가능한 상태로 연결합니다.</p></div>
          <div className="comparison">
            <div className="comparison-card weak"><h3><Bot/>AI만 사용하는 경우</h3>{['요구사항을 한 번에 크게 요청', '생성된 코드를 그대로 복사', '오류 메시지를 반복 입력', '기능 추가 때마다 구조 변경', '작동하면 완료라고 판단'].map(x=><p key={x}>{x}</p>)}</div>
            <div className="comparison-arrow"><ArrowRight /></div>
            <div className="comparison-card strong"><h3><ShieldCheck/>개발자 멘토링과 함께</h3>{['기능을 구현 가능한 단위로 분해', '현재 구조에 맞는지 검증', '실제 원인을 분석해 수정 방향 결정', '확장 가능한 기본 구조 유지', '배포와 앱 제출까지 계획'].map(x=><p key={x}><Check size={16}/>{x}</p>)}</div>
          </div>
        </section>

        <section className="section split-section">
          <div className="section-heading"><span className="eyebrow">웹 또는 앱</span><h2>아이디어에 맞는 구현 방식을 먼저 결정합니다.</h2><p>시장 범위가 넓다고 무조건 웹이 맞는 것도, App Store 출시가 목표라고 처음부터 앱이 맞는 것도 아닙니다.</p></div>
          <div className="choice-grid">
            <article className="choice-card"><Globe2 size={34}/><h3>웹서비스가 적합한 경우</h3>{['빠르게 아이디어를 검증하고 싶을 때','링크로 쉽게 공유해야 할 때','모바일과 PC에서 모두 사용해야 할 때','예약·신청·관리 기능이 필요할 때','심사 없이 즉시 배포하고 싶을 때'].map(x=><p key={x}><Check size={16}/>{x}</p>)}</article>
            <article className="choice-card"><Smartphone size={34}/><h3>iPhone 앱이 적합한 경우</h3>{['카메라·위치·알림 등 기기 기능이 중요할 때','반복 사용하는 개인 도구를 만들 때','App Store 출시가 목표일 때','iOS 취업 포트폴리오가 필요할 때','Swift·SwiftUI 실력을 쌓고 싶을 때'].map(x=><p key={x}><Check size={16}/>{x}</p>)}</article>
          </div>
        </section>

        <section className="section muted-section" id="programs">
          <div className="section-heading"><span className="eyebrow">프로그램</span><h2>현재 상태에 맞는 진입점부터 시작합니다.</h2></div>
          <div className="program-grid">{programs.map((p, index)=><article className={`program-card ${index===1?'featured':''}`} key={p.id}>{index===1&&<span className="recommended">추천</span>}<span className="program-eyebrow">{p.eyebrow}</span><h3>{p.title}</h3><p>{p.description}</p><div className="program-meta"><strong>{p.price}</strong><span>{p.duration}</span></div><ul>{p.outcomes.map(x=><li key={x}><Check size={17}/>{x}</li>)}</ul><p className="program-note">{p.note}</p><button className={`button ${index===1?'primary':'secondary'} wide`} onClick={()=>openModal(p.id==='diagnosis'?'paid':'free')}>{p.id==='diagnosis'?'진단 신청':'과정 상담'}<ArrowRight size={17}/></button></article>)}</div>
        </section>

        <section className="section" id="process">
          <div className="section-heading"><span className="eyebrow">8회 기본 과정</span><h2>수업마다 프로젝트가 실제로 앞으로 갑니다.</h2><p>프로젝트 난이도와 현재 수준에 따라 10회 과정이 권장될 수 있습니다.</p></div>
          <div className="timeline">{[
            ['01','범위 확정','목표와 현재 수준을 확인하고 8~10회 안에 구현할 핵심 기능을 정합니다.'],
            ['02','구조 설계','화면 흐름, 데이터 구조와 개발 순서를 정리합니다.'],
            ['03','핵심 구현','AI를 활용하되 수강생이 직접 코드를 작성하고 이해하도록 진행합니다.'],
            ['04','검증과 배포','오류와 구조를 점검하고 웹 배포 또는 App Store 제출을 준비합니다.'],
          ].map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div>
          <div className="support-note"><MessageCircle/><div><strong>수업 사이 간단한 질문 지원</strong><p>평일 기준 24~48시간 안에 답변하며, 장시간 디버깅과 신규 기능 구현은 다음 수업에서 진행합니다.</p></div></div>
        </section>

        <section className="section instructor-section" id="instructor">
          <div className="profile-photo"><img src="/profile.jpeg" alt={`${profile.name} 프로필 사진`} width="161" height="200" loading="lazy" decoding="async" /></div>
          <div><span className="eyebrow">강사 소개</span><h2>강의 경력의 숫자보다, 실제 개발 문제를 해결해 온 경험으로 지도합니다.</h2><p>서버, 웹, iOS 분야에서 약 5년간 개발자로 근무하며 실제 사용자가 이용하는 상용 서비스를 개발했습니다. 단순히 코드를 따라 작성하는 수업보다 수강생이 자신의 프로젝트를 직접 설계하고 오류를 해결하며 결과물을 완성하는 과정을 중요하게 생각합니다.</p><p>AI를 적극적으로 활용하되, 생성된 코드가 왜 작동하는지 이해하고 이후에도 직접 수정할 수 있도록 구조와 원리를 함께 설명합니다.</p><div className="stats"><span><strong>약 5년</strong>전체 개발 경력</span><span><strong>웹·서버·iOS</strong>실무 개발 영역</span><span><strong>8회 → 10회</strong>최근 수강생 연장 사례</span></div></div>
        </section>

        <section className="section muted-section" id="portfolio">
          <div className="section-heading"><span className="eyebrow">포트폴리오</span><h2>직접 기획하고 구현한 웹서비스입니다.</h2><p>아이디어를 실제 사용자가 이용할 수 있는 서비스로 설계하고 개발했습니다.</p></div>
          <div className="portfolio-grid">
            <a className="portfolio-card" href="https://loopeak.app" target="_blank" rel="noreferrer" aria-label="Loopeak 사이트 새 창에서 보기">
              <div className="portfolio-thumbnail"><img src="/portfolio/loopeak.png" alt="Loopeak 웹서비스 화면" width="1440" height="900" loading="lazy" decoding="async" /></div>
              <div className="portfolio-content"><div><span>언어 학습 웹서비스</span><h3>Loopeak</h3><p>문장을 보고, 듣고, 말하는 반복 학습을 통해 회화 표현을 익히는 서비스입니다.</p></div><ExternalLink size={21} aria-hidden="true" /></div>
            </a>
            <a className="portfolio-card" href="https://cheermeuplife.com" target="_blank" rel="noreferrer" aria-label="취미로운응원생활 사이트 새 창에서 보기">
              <div className="portfolio-thumbnail"><img src="/portfolio/cheermeuplife.png" alt="취미로운응원생활 웹사이트 화면" width="1440" height="900" loading="lazy" decoding="async" /></div>
              <div className="portfolio-content"><div><span>치어리딩 클래스 웹사이트</span><h3>취미로운응원생활</h3><p>치어리딩 레슨과 공연, 온라인 클래스를 소개하고 예약으로 연결하는 서비스입니다.</p></div><ExternalLink size={21} aria-hidden="true" /></div>
            </a>
          </div>
        </section>

        <ReviewSection />

        <section className="section boundaries">
          <div><span className="eyebrow">제공 범위</span><h2>멘토링과 외주 개발의 경계를 명확히 합니다.</h2></div>
          <div className="boundary-grid"><article><h3><Check/>함께하는 것</h3>{['프로젝트 방향과 MVP 범위 설정','기술 구조 설계와 AI 활용','코드 검토와 오류 분석','웹 배포 또는 앱 제출 준비','회차별 다음 작업 정리'].map(x=><p key={x}>{x}</p>)}</article><article><h3><X/>포함되지 않는 것</h3>{['전체 프로젝트 대리 개발','무제한 기능 추가와 실시간 지원','전문 디자인·서버 운영 대행','App Store 최종 승인 보장','유료 서비스·도메인·계정 비용'].map(x=><p key={x}>{x}</p>)}</article></div>
        </section>

        <section className="section muted-section" id="faq">
          <div className="section-heading"><span className="eyebrow">FAQ</span><h2>신청 전 자주 묻는 질문</h2></div>
          <div className="faq-list">{faqs.map(([q,a])=><details key={q}><summary>{q}<ChevronDown/></summary><p>{a}</p></details>)}</div>
        </section>

        <section className="final-cta section"><span className="eyebrow">첫 단계</span><h2>아이디어만 있거나, 이미 시작한 프로젝트가 막혀 있어도 괜찮습니다.</h2><p>현재 상태와 목표를 확인한 뒤 웹과 앱 중 적합한 방향, 필요한 회차와 현실적인 MVP 범위를 안내합니다.</p><div className="hero-actions"><button className="button primary" onClick={()=>openModal('free')}>15분 무료상담<ArrowRight size={18}/></button><button className="button inverse" onClick={()=>openModal('paid')}>유료 프로젝트 진단</button></div></section>
      </main>

      <footer><a className="brand" href="#top"><span className="brand-mark"><Code2 size={18}/></span>{profile.brand}</a><p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p><div><a href="/privacy.html">개인정보처리방침</a><a href="mailto:YOUR_EMAIL@example.com">이메일 문의</a></div></footer>
      <ConsultationModal open={modal.open} defaultType={modal.type} onClose={()=>setModal((m)=>({...m,open:false}))}/>
    </>
  );
}

export default App;
