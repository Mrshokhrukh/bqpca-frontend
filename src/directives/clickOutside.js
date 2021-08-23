const clickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function (event) {
      // Check that click was outside the element and its children
      if (!(el === event.target || el.contains(event.target))) {
        // Call the method given in the directive's value
        binding.value(event, el);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  },
};

export default clickOutside;