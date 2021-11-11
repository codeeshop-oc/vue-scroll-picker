
// Import vue component
// import component from '@/vue-scroll-picker.vue';
import ScrollPicker from "@/picker/picker"
import ScrollPickerGroup from "@/picker-group/picker-group"

export {
  ScrollPicker,
  ScrollPickerGroup,
}

// Default export is installable instance of component.
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),
export default /*#__PURE__*/(() => {
  // Get component instance
  const installable = ScrollPicker;

  // Attach install function executed by Vue.use()
  installable.install = (Vue) => {
    Vue.component("ScrollPicker", ScrollPicker)
    Vue.component("ScrollPickerGroup", ScrollPickerGroup)
  };
  return installable;
})();

// It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;
