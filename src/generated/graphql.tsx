import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as integer. Type represents date and time as number of milliseconds from start of UNIX epoch. */
  Timestamp: any;
};

export type Query = {
  __typename?: 'Query';
  me: User;
  myProjects: Array<Project>;
  project?: Maybe<Project>;
  tasks: TasksPaginatedResponse;
  task?: Maybe<Task>;
  usersOnProject: Array<UserOnProject>;
  comments: CommentsPaginatedResponse;
};


export type QueryProjectArgs = {
  id: Scalars['Int'];
};


export type QueryTasksArgs = {
  parentTaskId?: Maybe<Scalars['Int']>;
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  projectId: Scalars['Int'];
};


export type QueryTaskArgs = {
  id: Scalars['Int'];
  projectId: Scalars['Int'];
};


export type QueryUsersOnProjectArgs = {
  id: Scalars['Int'];
};


export type QueryCommentsArgs = {
  taskId?: Maybe<Scalars['Int']>;
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  projectId: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  email: Scalars['String'];
  name: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Project = {
  __typename?: 'Project';
  id: Scalars['Int'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  authorId: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  capabilities: UserProjectCapabilitiesType;
  taskCount: Scalars['Int'];
  userCount: Scalars['Int'];
};

export type UserProjectCapabilitiesType = {
  __typename?: 'UserProjectCapabilitiesType';
  canUpdateProject: Scalars['Boolean'];
  canDeleteProject: Scalars['Boolean'];
  canAddTask: Scalars['Boolean'];
  canUpdateTask: Scalars['Boolean'];
  canDeleteTask: Scalars['Boolean'];
  canCompleteTask: Scalars['Boolean'];
  canManageProjectUsers: Scalars['Boolean'];
  canComment: Scalars['Boolean'];
  canUpdateOtherComments: Scalars['Boolean'];
  canDeleteOtherComments: Scalars['Boolean'];
};

export type TasksPaginatedResponse = {
  __typename?: 'TasksPaginatedResponse';
  tasks: Array<Task>;
  hasMore: Scalars['Boolean'];
};

export type Task = {
  __typename?: 'Task';
  id: Scalars['Int'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  completed: Scalars['Boolean'];
  dueDate?: Maybe<Scalars['String']>;
  authorId: Scalars['Float'];
  projectId: Scalars['Float'];
  parentTaskId?: Maybe<Scalars['Float']>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type UserOnProject = {
  __typename?: 'UserOnProject';
  projectId: Scalars['Int'];
  user: User;
  project: Project;
  presetId?: Maybe<Scalars['Int']>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  capabilities: UserProjectCapabilitiesType;
};

export type CommentsPaginatedResponse = {
  __typename?: 'CommentsPaginatedResponse';
  comments: Array<Comment>;
  hasMore: Scalars['Boolean'];
};

export type Comment = {
  __typename?: 'Comment';
  id: Scalars['Int'];
  content: Scalars['String'];
  author: User;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  register: User;
  verifyEmail?: Maybe<User>;
  login: User;
  updateUser?: Maybe<User>;
  changePassword: Scalars['Boolean'];
  deleteUser: Scalars['Boolean'];
  logout: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  resetPassword: Scalars['Boolean'];
  createProject?: Maybe<Project>;
  updateProject?: Maybe<Project>;
  deleteProject: Scalars['Boolean'];
  createTask?: Maybe<Task>;
  updateTask?: Maybe<Task>;
  deleteTask: Scalars['Boolean'];
  completeTask?: Maybe<Task>;
  addUserToProject?: Maybe<UserOnProject>;
  removeUserFromProject: Scalars['Boolean'];
  createComment?: Maybe<Comment>;
  updateComment?: Maybe<Comment>;
  deleteComment: Scalars['Boolean'];
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationVerifyEmailArgs = {
  input: VerifyEmailInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
};


export type MutationUpdateProjectArgs = {
  input: CreateProjectInput;
  id: Scalars['Int'];
};


export type MutationDeleteProjectArgs = {
  id: Scalars['Int'];
};


export type MutationCreateTaskArgs = {
  parentTaskId?: Maybe<Scalars['Int']>;
  input: CreateTaskInput;
  projectId: Scalars['Int'];
};


export type MutationUpdateTaskArgs = {
  input: CreateTaskInput;
  id: Scalars['Int'];
  projectId: Scalars['Int'];
};


export type MutationDeleteTaskArgs = {
  id: Scalars['Int'];
  projectId: Scalars['Int'];
};


export type MutationCompleteTaskArgs = {
  isCompleted: Scalars['Boolean'];
  id: Scalars['Int'];
  projectId: Scalars['Int'];
};


export type MutationAddUserToProjectArgs = {
  input: AddUserToProjectInput;
  id: Scalars['Int'];
};


export type MutationRemoveUserFromProjectArgs = {
  userId: Scalars['Int'];
  id: Scalars['Int'];
};


export type MutationCreateCommentArgs = {
  taskId?: Maybe<Scalars['Int']>;
  projectId: Scalars['Int'];
  input: CreateCommentInput;
};


export type MutationUpdateCommentArgs = {
  input: CreateCommentInput;
  id: Scalars['Int'];
};


export type MutationDeleteCommentArgs = {
  projectId: Scalars['Int'];
  id: Scalars['Int'];
};

export type RegisterInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
};

export type VerifyEmailInput = {
  token: Scalars['String'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  rememberMe: Scalars['Boolean'];
};

export type UpdateUserInput = {
  name: Scalars['String'];
};

export type ChangePasswordInput = {
  password: Scalars['String'];
};

export type ResetPasswordInput = {
  password: Scalars['String'];
  token: Scalars['String'];
};

export type CreateProjectInput = {
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};

export type CreateTaskInput = {
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  dueDate?: Maybe<Scalars['Timestamp']>;
};


export type AddUserToProjectInput = {
  email: Scalars['String'];
  capabilities?: Maybe<UserProjectCapabilitiesInput>;
  rolePresetId?: Maybe<Scalars['Float']>;
};

export type UserProjectCapabilitiesInput = {
  canUpdateProject: Scalars['Boolean'];
  canDeleteProject: Scalars['Boolean'];
  canAddTask: Scalars['Boolean'];
  canUpdateTask: Scalars['Boolean'];
  canDeleteTask: Scalars['Boolean'];
  canCompleteTask: Scalars['Boolean'];
  canManageProjectUsers: Scalars['Boolean'];
  canComment: Scalars['Boolean'];
  canUpdateOtherComments: Scalars['Boolean'];
  canDeleteOtherComments: Scalars['Boolean'];
};

export type CreateCommentInput = {
  content: Scalars['String'];
};

export type CommentSnippetFragment = (
  { __typename?: 'Comment' }
  & Pick<Comment, 'id' | 'content' | 'createdAt'>
  & { author: (
    { __typename?: 'User' }
    & UserSnippetFragment
  ) }
);

export type ProjectSnippetFragment = (
  { __typename?: 'Project' }
  & Pick<Project, 'id' | 'title' | 'description' | 'authorId' | 'createdAt' | 'taskCount' | 'userCount'>
  & { capabilities: (
    { __typename?: 'UserProjectCapabilitiesType' }
    & UserProjectCapabilitiesSnippetFragment
  ) }
);

export type TaskSnippetFragment = (
  { __typename?: 'Task' }
  & Pick<Task, 'id' | 'title' | 'description' | 'dueDate' | 'createdAt' | 'completed'>
);

export type UserOnProjectSnippetFragment = (
  { __typename?: 'UserOnProject' }
  & Pick<UserOnProject, 'projectId' | 'presetId'>
  & { capabilities: (
    { __typename?: 'UserProjectCapabilitiesType' }
    & UserProjectCapabilitiesSnippetFragment
  ), user: (
    { __typename?: 'User' }
    & UserSnippetFragment
  ) }
);

export type UserProjectCapabilitiesSnippetFragment = (
  { __typename?: 'UserProjectCapabilitiesType' }
  & Pick<UserProjectCapabilitiesType, 'canUpdateProject' | 'canDeleteProject' | 'canAddTask' | 'canUpdateTask' | 'canDeleteTask' | 'canCompleteTask' | 'canManageProjectUsers' | 'canComment' | 'canUpdateOtherComments' | 'canDeleteOtherComments'>
);

export type UserSnippetFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'email' | 'name'>
);

export type AddUserToProjectMutationVariables = Exact<{
  id: Scalars['Int'];
  input: AddUserToProjectInput;
}>;


export type AddUserToProjectMutation = (
  { __typename?: 'Mutation' }
  & { addUserToProject?: Maybe<(
    { __typename?: 'UserOnProject' }
    & UserOnProjectSnippetFragment
  )> }
);

export type ChangePasswordMutationVariables = Exact<{
  input: ChangePasswordInput;
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'changePassword'>
);

export type CompleteTaskMutationVariables = Exact<{
  id: Scalars['Int'];
  projectId: Scalars['Int'];
  isCompleted: Scalars['Boolean'];
}>;


export type CompleteTaskMutation = (
  { __typename?: 'Mutation' }
  & { completeTask?: Maybe<(
    { __typename?: 'Task' }
    & Pick<Task, 'id' | 'completed'>
  )> }
);

export type CreateCommentMutationVariables = Exact<{
  projectId: Scalars['Int'];
  taskId?: Maybe<Scalars['Int']>;
  input: CreateCommentInput;
}>;


export type CreateCommentMutation = (
  { __typename?: 'Mutation' }
  & { createComment?: Maybe<(
    { __typename?: 'Comment' }
    & CommentSnippetFragment
  )> }
);

export type CreateProjectMutationVariables = Exact<{
  input: CreateProjectInput;
}>;


export type CreateProjectMutation = (
  { __typename?: 'Mutation' }
  & { createProject?: Maybe<(
    { __typename?: 'Project' }
    & ProjectSnippetFragment
  )> }
);

export type CreateTaskMutationVariables = Exact<{
  projectId: Scalars['Int'];
  parentTaskId?: Maybe<Scalars['Int']>;
  input: CreateTaskInput;
}>;


export type CreateTaskMutation = (
  { __typename?: 'Mutation' }
  & { createTask?: Maybe<(
    { __typename?: 'Task' }
    & TaskSnippetFragment
  )> }
);

export type DeleteCommentMutationVariables = Exact<{
  id: Scalars['Int'];
  projectId: Scalars['Int'];
}>;


export type DeleteCommentMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteComment'>
);

export type DeleteProjectMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteProjectMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteProject'>
);

export type DeleteTaskMutationVariables = Exact<{
  id: Scalars['Int'];
  projectId: Scalars['Int'];
}>;


export type DeleteTaskMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteTask'>
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'User' }
    & UserSnippetFragment
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'User' }
    & UserSnippetFragment
  ) }
);

export type RemoveUserFromProjectMutationVariables = Exact<{
  id: Scalars['Int'];
  userId: Scalars['Int'];
}>;


export type RemoveUserFromProjectMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'removeUserFromProject'>
);

export type ResetPasswordMutationVariables = Exact<{
  input: ResetPasswordInput;
}>;


export type ResetPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'resetPassword'>
);

export type UpdateCommentMutationVariables = Exact<{
  id: Scalars['Int'];
  input: CreateCommentInput;
}>;


export type UpdateCommentMutation = (
  { __typename?: 'Mutation' }
  & { updateComment?: Maybe<(
    { __typename?: 'Comment' }
    & CommentSnippetFragment
  )> }
);

export type UpdateProjectMutationVariables = Exact<{
  id: Scalars['Int'];
  input: CreateProjectInput;
}>;


export type UpdateProjectMutation = (
  { __typename?: 'Mutation' }
  & { updateProject?: Maybe<(
    { __typename?: 'Project' }
    & ProjectSnippetFragment
  )> }
);

export type UpdateTaskMutationVariables = Exact<{
  id: Scalars['Int'];
  projectId: Scalars['Int'];
  input: CreateTaskInput;
}>;


export type UpdateTaskMutation = (
  { __typename?: 'Mutation' }
  & { updateTask?: Maybe<(
    { __typename?: 'Task' }
    & TaskSnippetFragment
  )> }
);

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUser?: Maybe<(
    { __typename?: 'User' }
    & UserSnippetFragment
  )> }
);

export type VerifyEmailMutationVariables = Exact<{
  input: VerifyEmailInput;
}>;


export type VerifyEmailMutation = (
  { __typename?: 'Mutation' }
  & { verifyEmail?: Maybe<(
    { __typename?: 'User' }
    & UserSnippetFragment
  )> }
);

export type CommentsQueryVariables = Exact<{
  projectId: Scalars['Int'];
  offset: Scalars['Int'];
  limit: Scalars['Int'];
  taskId?: Maybe<Scalars['Int']>;
}>;


export type CommentsQuery = (
  { __typename?: 'Query' }
  & { comments: (
    { __typename?: 'CommentsPaginatedResponse' }
    & Pick<CommentsPaginatedResponse, 'hasMore'>
    & { comments: Array<(
      { __typename?: 'Comment' }
      & CommentSnippetFragment
    )> }
  ) }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'User' }
    & UserSnippetFragment
  ) }
);

export type MyProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyProjectsQuery = (
  { __typename?: 'Query' }
  & { myProjects: Array<(
    { __typename?: 'Project' }
    & ProjectSnippetFragment
  )> }
);

export type ProjectQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ProjectQuery = (
  { __typename?: 'Query' }
  & { project?: Maybe<(
    { __typename?: 'Project' }
    & ProjectSnippetFragment
  )> }
);

export type TaskQueryVariables = Exact<{
  id: Scalars['Int'];
  projectId: Scalars['Int'];
}>;


export type TaskQuery = (
  { __typename?: 'Query' }
  & { task?: Maybe<(
    { __typename?: 'Task' }
    & TaskSnippetFragment
  )> }
);

export type TasksQueryVariables = Exact<{
  projectId: Scalars['Int'];
  offset: Scalars['Int'];
  limit: Scalars['Int'];
  parentTaskId?: Maybe<Scalars['Int']>;
}>;


export type TasksQuery = (
  { __typename?: 'Query' }
  & { tasks: (
    { __typename?: 'TasksPaginatedResponse' }
    & Pick<TasksPaginatedResponse, 'hasMore'>
    & { tasks: Array<(
      { __typename?: 'Task' }
      & TaskSnippetFragment
    )> }
  ) }
);

export type UsersOnProjectQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type UsersOnProjectQuery = (
  { __typename?: 'Query' }
  & { usersOnProject: Array<(
    { __typename?: 'UserOnProject' }
    & UserOnProjectSnippetFragment
  )> }
);

export const UserSnippetFragmentDoc = gql`
    fragment UserSnippet on User {
  id
  email
  name
}
    `;
export const CommentSnippetFragmentDoc = gql`
    fragment CommentSnippet on Comment {
  id
  author {
    ...UserSnippet
  }
  content
  createdAt
}
    ${UserSnippetFragmentDoc}`;
export const UserProjectCapabilitiesSnippetFragmentDoc = gql`
    fragment UserProjectCapabilitiesSnippet on UserProjectCapabilitiesType {
  canUpdateProject
  canDeleteProject
  canAddTask
  canUpdateTask
  canDeleteTask
  canCompleteTask
  canManageProjectUsers
  canComment
  canUpdateOtherComments
  canDeleteOtherComments
}
    `;
export const ProjectSnippetFragmentDoc = gql`
    fragment ProjectSnippet on Project {
  id
  title
  description
  authorId
  createdAt
  taskCount
  userCount
  capabilities {
    ...UserProjectCapabilitiesSnippet
  }
}
    ${UserProjectCapabilitiesSnippetFragmentDoc}`;
export const TaskSnippetFragmentDoc = gql`
    fragment TaskSnippet on Task {
  id
  title
  description
  dueDate
  createdAt
  completed
}
    `;
export const UserOnProjectSnippetFragmentDoc = gql`
    fragment UserOnProjectSnippet on UserOnProject {
  projectId
  presetId
  capabilities {
    ...UserProjectCapabilitiesSnippet
  }
  user {
    ...UserSnippet
  }
}
    ${UserProjectCapabilitiesSnippetFragmentDoc}
${UserSnippetFragmentDoc}`;
export const AddUserToProjectDocument = gql`
    mutation AddUserToProject($id: Int!, $input: AddUserToProjectInput!) {
  addUserToProject(id: $id, input: $input) {
    ...UserOnProjectSnippet
  }
}
    ${UserOnProjectSnippetFragmentDoc}`;
export type AddUserToProjectMutationFn = Apollo.MutationFunction<AddUserToProjectMutation, AddUserToProjectMutationVariables>;

/**
 * __useAddUserToProjectMutation__
 *
 * To run a mutation, you first call `useAddUserToProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddUserToProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addUserToProjectMutation, { data, loading, error }] = useAddUserToProjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddUserToProjectMutation(baseOptions?: Apollo.MutationHookOptions<AddUserToProjectMutation, AddUserToProjectMutationVariables>) {
        return Apollo.useMutation<AddUserToProjectMutation, AddUserToProjectMutationVariables>(AddUserToProjectDocument, baseOptions);
      }
export type AddUserToProjectMutationHookResult = ReturnType<typeof useAddUserToProjectMutation>;
export type AddUserToProjectMutationResult = Apollo.MutationResult<AddUserToProjectMutation>;
export type AddUserToProjectMutationOptions = Apollo.BaseMutationOptions<AddUserToProjectMutation, AddUserToProjectMutationVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($input: ChangePasswordInput!) {
  changePassword(input: $input)
}
    `;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, baseOptions);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const CompleteTaskDocument = gql`
    mutation CompleteTask($id: Int!, $projectId: Int!, $isCompleted: Boolean!) {
  completeTask(id: $id, projectId: $projectId, isCompleted: $isCompleted) {
    id
    completed
  }
}
    `;
export type CompleteTaskMutationFn = Apollo.MutationFunction<CompleteTaskMutation, CompleteTaskMutationVariables>;

/**
 * __useCompleteTaskMutation__
 *
 * To run a mutation, you first call `useCompleteTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeTaskMutation, { data, loading, error }] = useCompleteTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *      projectId: // value for 'projectId'
 *      isCompleted: // value for 'isCompleted'
 *   },
 * });
 */
export function useCompleteTaskMutation(baseOptions?: Apollo.MutationHookOptions<CompleteTaskMutation, CompleteTaskMutationVariables>) {
        return Apollo.useMutation<CompleteTaskMutation, CompleteTaskMutationVariables>(CompleteTaskDocument, baseOptions);
      }
export type CompleteTaskMutationHookResult = ReturnType<typeof useCompleteTaskMutation>;
export type CompleteTaskMutationResult = Apollo.MutationResult<CompleteTaskMutation>;
export type CompleteTaskMutationOptions = Apollo.BaseMutationOptions<CompleteTaskMutation, CompleteTaskMutationVariables>;
export const CreateCommentDocument = gql`
    mutation CreateComment($projectId: Int!, $taskId: Int, $input: CreateCommentInput!) {
  createComment(projectId: $projectId, taskId: $taskId, input: $input) {
    ...CommentSnippet
  }
}
    ${CommentSnippetFragmentDoc}`;
export type CreateCommentMutationFn = Apollo.MutationFunction<CreateCommentMutation, CreateCommentMutationVariables>;

/**
 * __useCreateCommentMutation__
 *
 * To run a mutation, you first call `useCreateCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCommentMutation, { data, loading, error }] = useCreateCommentMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      taskId: // value for 'taskId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCommentMutation(baseOptions?: Apollo.MutationHookOptions<CreateCommentMutation, CreateCommentMutationVariables>) {
        return Apollo.useMutation<CreateCommentMutation, CreateCommentMutationVariables>(CreateCommentDocument, baseOptions);
      }
export type CreateCommentMutationHookResult = ReturnType<typeof useCreateCommentMutation>;
export type CreateCommentMutationResult = Apollo.MutationResult<CreateCommentMutation>;
export type CreateCommentMutationOptions = Apollo.BaseMutationOptions<CreateCommentMutation, CreateCommentMutationVariables>;
export const CreateProjectDocument = gql`
    mutation CreateProject($input: CreateProjectInput!) {
  createProject(input: $input) {
    ...ProjectSnippet
  }
}
    ${ProjectSnippetFragmentDoc}`;
export type CreateProjectMutationFn = Apollo.MutationFunction<CreateProjectMutation, CreateProjectMutationVariables>;

/**
 * __useCreateProjectMutation__
 *
 * To run a mutation, you first call `useCreateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMutation, { data, loading, error }] = useCreateProjectMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProjectMutation(baseOptions?: Apollo.MutationHookOptions<CreateProjectMutation, CreateProjectMutationVariables>) {
        return Apollo.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, baseOptions);
      }
export type CreateProjectMutationHookResult = ReturnType<typeof useCreateProjectMutation>;
export type CreateProjectMutationResult = Apollo.MutationResult<CreateProjectMutation>;
export type CreateProjectMutationOptions = Apollo.BaseMutationOptions<CreateProjectMutation, CreateProjectMutationVariables>;
export const CreateTaskDocument = gql`
    mutation CreateTask($projectId: Int!, $parentTaskId: Int, $input: CreateTaskInput!) {
  createTask(projectId: $projectId, parentTaskId: $parentTaskId, input: $input) {
    ...TaskSnippet
  }
}
    ${TaskSnippetFragmentDoc}`;
export type CreateTaskMutationFn = Apollo.MutationFunction<CreateTaskMutation, CreateTaskMutationVariables>;

/**
 * __useCreateTaskMutation__
 *
 * To run a mutation, you first call `useCreateTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTaskMutation, { data, loading, error }] = useCreateTaskMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      parentTaskId: // value for 'parentTaskId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTaskMutation(baseOptions?: Apollo.MutationHookOptions<CreateTaskMutation, CreateTaskMutationVariables>) {
        return Apollo.useMutation<CreateTaskMutation, CreateTaskMutationVariables>(CreateTaskDocument, baseOptions);
      }
export type CreateTaskMutationHookResult = ReturnType<typeof useCreateTaskMutation>;
export type CreateTaskMutationResult = Apollo.MutationResult<CreateTaskMutation>;
export type CreateTaskMutationOptions = Apollo.BaseMutationOptions<CreateTaskMutation, CreateTaskMutationVariables>;
export const DeleteCommentDocument = gql`
    mutation DeleteComment($id: Int!, $projectId: Int!) {
  deleteComment(id: $id, projectId: $projectId)
}
    `;
export type DeleteCommentMutationFn = Apollo.MutationFunction<DeleteCommentMutation, DeleteCommentMutationVariables>;

/**
 * __useDeleteCommentMutation__
 *
 * To run a mutation, you first call `useDeleteCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCommentMutation, { data, loading, error }] = useDeleteCommentMutation({
 *   variables: {
 *      id: // value for 'id'
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useDeleteCommentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCommentMutation, DeleteCommentMutationVariables>) {
        return Apollo.useMutation<DeleteCommentMutation, DeleteCommentMutationVariables>(DeleteCommentDocument, baseOptions);
      }
export type DeleteCommentMutationHookResult = ReturnType<typeof useDeleteCommentMutation>;
export type DeleteCommentMutationResult = Apollo.MutationResult<DeleteCommentMutation>;
export type DeleteCommentMutationOptions = Apollo.BaseMutationOptions<DeleteCommentMutation, DeleteCommentMutationVariables>;
export const DeleteProjectDocument = gql`
    mutation DeleteProject($id: Int!) {
  deleteProject(id: $id)
}
    `;
export type DeleteProjectMutationFn = Apollo.MutationFunction<DeleteProjectMutation, DeleteProjectMutationVariables>;

/**
 * __useDeleteProjectMutation__
 *
 * To run a mutation, you first call `useDeleteProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectMutation, { data, loading, error }] = useDeleteProjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProjectMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProjectMutation, DeleteProjectMutationVariables>) {
        return Apollo.useMutation<DeleteProjectMutation, DeleteProjectMutationVariables>(DeleteProjectDocument, baseOptions);
      }
export type DeleteProjectMutationHookResult = ReturnType<typeof useDeleteProjectMutation>;
export type DeleteProjectMutationResult = Apollo.MutationResult<DeleteProjectMutation>;
export type DeleteProjectMutationOptions = Apollo.BaseMutationOptions<DeleteProjectMutation, DeleteProjectMutationVariables>;
export const DeleteTaskDocument = gql`
    mutation DeleteTask($id: Int!, $projectId: Int!) {
  deleteTask(id: $id, projectId: $projectId)
}
    `;
export type DeleteTaskMutationFn = Apollo.MutationFunction<DeleteTaskMutation, DeleteTaskMutationVariables>;

/**
 * __useDeleteTaskMutation__
 *
 * To run a mutation, you first call `useDeleteTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTaskMutation, { data, loading, error }] = useDeleteTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useDeleteTaskMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTaskMutation, DeleteTaskMutationVariables>) {
        return Apollo.useMutation<DeleteTaskMutation, DeleteTaskMutationVariables>(DeleteTaskDocument, baseOptions);
      }
export type DeleteTaskMutationHookResult = ReturnType<typeof useDeleteTaskMutation>;
export type DeleteTaskMutationResult = Apollo.MutationResult<DeleteTaskMutation>;
export type DeleteTaskMutationOptions = Apollo.BaseMutationOptions<DeleteTaskMutation, DeleteTaskMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, baseOptions);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    ...UserSnippet
  }
}
    ${UserSnippetFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($input: RegisterInput!) {
  register(input: $input) {
    ...UserSnippet
  }
}
    ${UserSnippetFragmentDoc}`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, baseOptions);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const RemoveUserFromProjectDocument = gql`
    mutation RemoveUserFromProject($id: Int!, $userId: Int!) {
  removeUserFromProject(id: $id, userId: $userId)
}
    `;
export type RemoveUserFromProjectMutationFn = Apollo.MutationFunction<RemoveUserFromProjectMutation, RemoveUserFromProjectMutationVariables>;

/**
 * __useRemoveUserFromProjectMutation__
 *
 * To run a mutation, you first call `useRemoveUserFromProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveUserFromProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeUserFromProjectMutation, { data, loading, error }] = useRemoveUserFromProjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useRemoveUserFromProjectMutation(baseOptions?: Apollo.MutationHookOptions<RemoveUserFromProjectMutation, RemoveUserFromProjectMutationVariables>) {
        return Apollo.useMutation<RemoveUserFromProjectMutation, RemoveUserFromProjectMutationVariables>(RemoveUserFromProjectDocument, baseOptions);
      }
export type RemoveUserFromProjectMutationHookResult = ReturnType<typeof useRemoveUserFromProjectMutation>;
export type RemoveUserFromProjectMutationResult = Apollo.MutationResult<RemoveUserFromProjectMutation>;
export type RemoveUserFromProjectMutationOptions = Apollo.BaseMutationOptions<RemoveUserFromProjectMutation, RemoveUserFromProjectMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation ResetPassword($input: ResetPasswordInput!) {
  resetPassword(input: $input)
}
    `;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, baseOptions);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const UpdateCommentDocument = gql`
    mutation UpdateComment($id: Int!, $input: CreateCommentInput!) {
  updateComment(id: $id, input: $input) {
    ...CommentSnippet
  }
}
    ${CommentSnippetFragmentDoc}`;
export type UpdateCommentMutationFn = Apollo.MutationFunction<UpdateCommentMutation, UpdateCommentMutationVariables>;

/**
 * __useUpdateCommentMutation__
 *
 * To run a mutation, you first call `useUpdateCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCommentMutation, { data, loading, error }] = useUpdateCommentMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCommentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCommentMutation, UpdateCommentMutationVariables>) {
        return Apollo.useMutation<UpdateCommentMutation, UpdateCommentMutationVariables>(UpdateCommentDocument, baseOptions);
      }
export type UpdateCommentMutationHookResult = ReturnType<typeof useUpdateCommentMutation>;
export type UpdateCommentMutationResult = Apollo.MutationResult<UpdateCommentMutation>;
export type UpdateCommentMutationOptions = Apollo.BaseMutationOptions<UpdateCommentMutation, UpdateCommentMutationVariables>;
export const UpdateProjectDocument = gql`
    mutation UpdateProject($id: Int!, $input: CreateProjectInput!) {
  updateProject(id: $id, input: $input) {
    ...ProjectSnippet
  }
}
    ${ProjectSnippetFragmentDoc}`;
export type UpdateProjectMutationFn = Apollo.MutationFunction<UpdateProjectMutation, UpdateProjectMutationVariables>;

/**
 * __useUpdateProjectMutation__
 *
 * To run a mutation, you first call `useUpdateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectMutation, { data, loading, error }] = useUpdateProjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProjectMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProjectMutation, UpdateProjectMutationVariables>) {
        return Apollo.useMutation<UpdateProjectMutation, UpdateProjectMutationVariables>(UpdateProjectDocument, baseOptions);
      }
export type UpdateProjectMutationHookResult = ReturnType<typeof useUpdateProjectMutation>;
export type UpdateProjectMutationResult = Apollo.MutationResult<UpdateProjectMutation>;
export type UpdateProjectMutationOptions = Apollo.BaseMutationOptions<UpdateProjectMutation, UpdateProjectMutationVariables>;
export const UpdateTaskDocument = gql`
    mutation UpdateTask($id: Int!, $projectId: Int!, $input: CreateTaskInput!) {
  updateTask(id: $id, projectId: $projectId, input: $input) {
    ...TaskSnippet
  }
}
    ${TaskSnippetFragmentDoc}`;
export type UpdateTaskMutationFn = Apollo.MutationFunction<UpdateTaskMutation, UpdateTaskMutationVariables>;

/**
 * __useUpdateTaskMutation__
 *
 * To run a mutation, you first call `useUpdateTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTaskMutation, { data, loading, error }] = useUpdateTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *      projectId: // value for 'projectId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTaskMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTaskMutation, UpdateTaskMutationVariables>) {
        return Apollo.useMutation<UpdateTaskMutation, UpdateTaskMutationVariables>(UpdateTaskDocument, baseOptions);
      }
export type UpdateTaskMutationHookResult = ReturnType<typeof useUpdateTaskMutation>;
export type UpdateTaskMutationResult = Apollo.MutationResult<UpdateTaskMutation>;
export type UpdateTaskMutationOptions = Apollo.BaseMutationOptions<UpdateTaskMutation, UpdateTaskMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    ...UserSnippet
  }
}
    ${UserSnippetFragmentDoc}`;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, baseOptions);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const VerifyEmailDocument = gql`
    mutation VerifyEmail($input: VerifyEmailInput!) {
  verifyEmail(input: $input) {
    ...UserSnippet
  }
}
    ${UserSnippetFragmentDoc}`;
export type VerifyEmailMutationFn = Apollo.MutationFunction<VerifyEmailMutation, VerifyEmailMutationVariables>;

/**
 * __useVerifyEmailMutation__
 *
 * To run a mutation, you first call `useVerifyEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyEmailMutation, { data, loading, error }] = useVerifyEmailMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useVerifyEmailMutation(baseOptions?: Apollo.MutationHookOptions<VerifyEmailMutation, VerifyEmailMutationVariables>) {
        return Apollo.useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(VerifyEmailDocument, baseOptions);
      }
export type VerifyEmailMutationHookResult = ReturnType<typeof useVerifyEmailMutation>;
export type VerifyEmailMutationResult = Apollo.MutationResult<VerifyEmailMutation>;
export type VerifyEmailMutationOptions = Apollo.BaseMutationOptions<VerifyEmailMutation, VerifyEmailMutationVariables>;
export const CommentsDocument = gql`
    query Comments($projectId: Int!, $offset: Int!, $limit: Int!, $taskId: Int) {
  comments(projectId: $projectId, offset: $offset, limit: $limit, taskId: $taskId) {
    comments {
      ...CommentSnippet
    }
    hasMore
  }
}
    ${CommentSnippetFragmentDoc}`;

/**
 * __useCommentsQuery__
 *
 * To run a query within a React component, call `useCommentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCommentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommentsQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *      taskId: // value for 'taskId'
 *   },
 * });
 */
export function useCommentsQuery(baseOptions?: Apollo.QueryHookOptions<CommentsQuery, CommentsQueryVariables>) {
        return Apollo.useQuery<CommentsQuery, CommentsQueryVariables>(CommentsDocument, baseOptions);
      }
export function useCommentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CommentsQuery, CommentsQueryVariables>) {
          return Apollo.useLazyQuery<CommentsQuery, CommentsQueryVariables>(CommentsDocument, baseOptions);
        }
export type CommentsQueryHookResult = ReturnType<typeof useCommentsQuery>;
export type CommentsLazyQueryHookResult = ReturnType<typeof useCommentsLazyQuery>;
export type CommentsQueryResult = Apollo.QueryResult<CommentsQuery, CommentsQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...UserSnippet
  }
}
    ${UserSnippetFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const MyProjectsDocument = gql`
    query MyProjects {
  myProjects {
    ...ProjectSnippet
  }
}
    ${ProjectSnippetFragmentDoc}`;

/**
 * __useMyProjectsQuery__
 *
 * To run a query within a React component, call `useMyProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyProjectsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyProjectsQuery(baseOptions?: Apollo.QueryHookOptions<MyProjectsQuery, MyProjectsQueryVariables>) {
        return Apollo.useQuery<MyProjectsQuery, MyProjectsQueryVariables>(MyProjectsDocument, baseOptions);
      }
export function useMyProjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyProjectsQuery, MyProjectsQueryVariables>) {
          return Apollo.useLazyQuery<MyProjectsQuery, MyProjectsQueryVariables>(MyProjectsDocument, baseOptions);
        }
export type MyProjectsQueryHookResult = ReturnType<typeof useMyProjectsQuery>;
export type MyProjectsLazyQueryHookResult = ReturnType<typeof useMyProjectsLazyQuery>;
export type MyProjectsQueryResult = Apollo.QueryResult<MyProjectsQuery, MyProjectsQueryVariables>;
export const ProjectDocument = gql`
    query Project($id: Int!) {
  project(id: $id) {
    ...ProjectSnippet
  }
}
    ${ProjectSnippetFragmentDoc}`;

/**
 * __useProjectQuery__
 *
 * To run a query within a React component, call `useProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProjectQuery(baseOptions?: Apollo.QueryHookOptions<ProjectQuery, ProjectQueryVariables>) {
        return Apollo.useQuery<ProjectQuery, ProjectQueryVariables>(ProjectDocument, baseOptions);
      }
export function useProjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProjectQuery, ProjectQueryVariables>) {
          return Apollo.useLazyQuery<ProjectQuery, ProjectQueryVariables>(ProjectDocument, baseOptions);
        }
export type ProjectQueryHookResult = ReturnType<typeof useProjectQuery>;
export type ProjectLazyQueryHookResult = ReturnType<typeof useProjectLazyQuery>;
export type ProjectQueryResult = Apollo.QueryResult<ProjectQuery, ProjectQueryVariables>;
export const TaskDocument = gql`
    query Task($id: Int!, $projectId: Int!) {
  task(id: $id, projectId: $projectId) {
    ...TaskSnippet
  }
}
    ${TaskSnippetFragmentDoc}`;

/**
 * __useTaskQuery__
 *
 * To run a query within a React component, call `useTaskQuery` and pass it any options that fit your needs.
 * When your component renders, `useTaskQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTaskQuery({
 *   variables: {
 *      id: // value for 'id'
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useTaskQuery(baseOptions?: Apollo.QueryHookOptions<TaskQuery, TaskQueryVariables>) {
        return Apollo.useQuery<TaskQuery, TaskQueryVariables>(TaskDocument, baseOptions);
      }
export function useTaskLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TaskQuery, TaskQueryVariables>) {
          return Apollo.useLazyQuery<TaskQuery, TaskQueryVariables>(TaskDocument, baseOptions);
        }
export type TaskQueryHookResult = ReturnType<typeof useTaskQuery>;
export type TaskLazyQueryHookResult = ReturnType<typeof useTaskLazyQuery>;
export type TaskQueryResult = Apollo.QueryResult<TaskQuery, TaskQueryVariables>;
export const TasksDocument = gql`
    query Tasks($projectId: Int!, $offset: Int!, $limit: Int!, $parentTaskId: Int) {
  tasks(projectId: $projectId, offset: $offset, limit: $limit, parentTaskId: $parentTaskId) {
    hasMore
    tasks {
      ...TaskSnippet
    }
  }
}
    ${TaskSnippetFragmentDoc}`;

/**
 * __useTasksQuery__
 *
 * To run a query within a React component, call `useTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useTasksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTasksQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *      parentTaskId: // value for 'parentTaskId'
 *   },
 * });
 */
export function useTasksQuery(baseOptions?: Apollo.QueryHookOptions<TasksQuery, TasksQueryVariables>) {
        return Apollo.useQuery<TasksQuery, TasksQueryVariables>(TasksDocument, baseOptions);
      }
export function useTasksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TasksQuery, TasksQueryVariables>) {
          return Apollo.useLazyQuery<TasksQuery, TasksQueryVariables>(TasksDocument, baseOptions);
        }
export type TasksQueryHookResult = ReturnType<typeof useTasksQuery>;
export type TasksLazyQueryHookResult = ReturnType<typeof useTasksLazyQuery>;
export type TasksQueryResult = Apollo.QueryResult<TasksQuery, TasksQueryVariables>;
export const UsersOnProjectDocument = gql`
    query UsersOnProject($id: Int!) {
  usersOnProject(id: $id) {
    ...UserOnProjectSnippet
  }
}
    ${UserOnProjectSnippetFragmentDoc}`;

/**
 * __useUsersOnProjectQuery__
 *
 * To run a query within a React component, call `useUsersOnProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersOnProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersOnProjectQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUsersOnProjectQuery(baseOptions?: Apollo.QueryHookOptions<UsersOnProjectQuery, UsersOnProjectQueryVariables>) {
        return Apollo.useQuery<UsersOnProjectQuery, UsersOnProjectQueryVariables>(UsersOnProjectDocument, baseOptions);
      }
export function useUsersOnProjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersOnProjectQuery, UsersOnProjectQueryVariables>) {
          return Apollo.useLazyQuery<UsersOnProjectQuery, UsersOnProjectQueryVariables>(UsersOnProjectDocument, baseOptions);
        }
export type UsersOnProjectQueryHookResult = ReturnType<typeof useUsersOnProjectQuery>;
export type UsersOnProjectLazyQueryHookResult = ReturnType<typeof useUsersOnProjectLazyQuery>;
export type UsersOnProjectQueryResult = Apollo.QueryResult<UsersOnProjectQuery, UsersOnProjectQueryVariables>;