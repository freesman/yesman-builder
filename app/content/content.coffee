require('./content.styl')
fancybox = require('./../scripts/fancybox')

$('[data-js-img]').fancybox(
  openEffect: 'none'
  closeEffect: 'none'
  prevEffect: 'none'
  nextEffect: 'none'
  href: 'index.html'
  helpers:
    title: null
)
