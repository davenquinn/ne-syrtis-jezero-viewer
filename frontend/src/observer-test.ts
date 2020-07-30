// https://24ways.org/2019/beautiful-scrolling-experiences-without-libraries/

const sections = [...document.querySelectorAll('section')]

const options = {
  rootMargin: '0px',
  threshold: 0.25
}

const callback = (entries) => {
  entries.forEach((entry) => {
    if (entry.intersectionRatio >= 0.25) {
      target.classList.add("is-visible");
    } else {
      target.classList.remove("is-visible");
    }
  })
}

const observer = new IntersectionObserver(callback, options)

sections.forEach((section, index) => {
  observer.observe(section)
})
