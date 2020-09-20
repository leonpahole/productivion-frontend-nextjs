import moment from "moment";

export const DATE_FORMAT = "DD. MM. yyyy";

export const formatTimestamp = (t: string) =>
  moment(Number(t)).format(DATE_FORMAT);
