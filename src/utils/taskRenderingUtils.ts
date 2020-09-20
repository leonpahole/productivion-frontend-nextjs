import { TasksQuery, CommentsQuery } from "../generated/graphql";
import moment from "moment";
import { DATE_FORMAT } from "./dateFormat";

export type GraphqlTask = TasksQuery["tasks"][0];
export type GraphqlComment = CommentsQuery["comments"][0];

export const getCompletedTextStyle = (task: GraphqlTask): string => {
  if (task.completed) {
    return "line-through";
  }

  return "";
};

export const getMomentDate = (
  dueDate: string | null | undefined
): moment.Moment | null => {
  if (!dueDate) {
    return null;
  }

  const momentDate = moment(dueDate);
  if (!momentDate.isValid()) {
    return null;
  }

  return momentDate;
};

export const dueDateColorWarning = (task: GraphqlTask): string => {
  const momentDate = getMomentDate(task.dueDate);

  if (!momentDate) {
    return "";
  }

  const today = moment();

  if (momentDate.isSame(today, "day")) {
    return "orange";
  } else if (momentDate.isBefore(today, "day")) {
    return "red";
  }

  return "";
};

export const renderDueDate = (task: GraphqlTask): string => {
  if (!task.dueDate) {
    return "";
  }

  let momentDate = moment(task.dueDate);

  if (!momentDate.isValid()) {
    momentDate = moment(Number(task.dueDate));

    if (!momentDate.isValid()) {
      return "";
    }
  }

  let dueText = "Due";
  const isBeforeToday = momentDate.isBefore(moment(), "day");

  if (task.completed || isBeforeToday) {
    dueText = "Was due";
  }

  return `${dueText} ${momentDate.format(
    DATE_FORMAT
  )} (${momentDate.fromNow()})`;
};
