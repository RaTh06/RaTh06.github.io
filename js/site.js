(() => {
  const header = document.getElementById('page-header')
  const recentItems = document.querySelectorAll('#recent-posts .recent-post-item')
  const scrollDown = document.getElementById('scroll-down')

  const syncHeader = () => {
    if (!header) return
    header.classList.toggle('is-scrolled', window.scrollY > 24)
  }

  const setupReveal = () => {
    if (!recentItems.length) return

    const revealVisibleItems = () => {
      recentItems.forEach(item => {
        if (item.getBoundingClientRect().top < window.innerHeight * .92) {
          item.classList.add('is-visible')
        }
      })
    }

    recentItems.forEach((item, index) => {
      item.style.animationDelay = `${Math.min(index * 70, 350)}ms`
      item.classList.add('will-reveal')
    })

    if (!('IntersectionObserver' in window)) {
      recentItems.forEach(item => item.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 })

    recentItems.forEach(item => observer.observe(item))
    requestAnimationFrame(revealVisibleItems)
    window.setTimeout(revealVisibleItems, 240)
    window.addEventListener('scroll', revealVisibleItems, { passive: true })
  }

  const setupHero = () => {
    if (!header?.classList.contains('full_page')) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
      header.addEventListener('pointermove', event => {
        const x = (event.clientX / window.innerWidth - .5) * 10
        const y = (event.clientY / window.innerHeight - .5) * 6
        header.style.setProperty('--hero-x', `${x.toFixed(2)}px`)
        header.style.setProperty('--hero-y', `${y.toFixed(2)}px`)
      }, { passive: true })
    }

    scrollDown?.addEventListener('click', () => {
      const content = document.getElementById('content-inner')
      content?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    })
  }

  const setupThemeTransition = () => {
    const root = document.documentElement
    const observer = new MutationObserver(() => {
      document.body.classList.add('theme-transition')
      window.setTimeout(() => document.body.classList.remove('theme-transition'), 380)
    })
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
  }

  syncHeader()
  setupReveal()
  setupHero()
  setupThemeTransition()
  window.addEventListener('scroll', syncHeader, { passive: true })
})()
