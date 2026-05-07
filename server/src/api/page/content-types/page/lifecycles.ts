export default {
  beforeCreate(event: any) {
    if (!event.params.data.pageHeader) {
      event.params.data.pageHeader = {
        hideHeader: false,
        headerType: "text",
        headerSize: "small",
        horizontalLayout: false,
      };
    }
  },
};
