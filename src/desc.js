class DescriptedDiff {
    format(delta, left) {
      const context = {};
      this.prepareContext(context);
      this.recurse(context, delta, left);
      return this.finalize(context);
    }
}

export default DescriptedDiff;