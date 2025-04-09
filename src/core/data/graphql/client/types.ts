import gql from "graphql-tag";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: { input: string; output: string };
	String: { input: string; output: string };
	Boolean: { input: boolean; output: boolean };
	Int: { input: number; output: number };
	Float: { input: number; output: number };
	Date: { input: any; output: any };
};

export type CreateExpenseInput = {
	category: Scalars["String"]["input"];
	description?: InputMaybe<Scalars["String"]["input"]>;
	dueDate: Scalars["Date"]["input"];
	installments?: InputMaybe<Scalars["Int"]["input"]>;
	recurrence?: InputMaybe<RecurrenceInput>;
	tags?: InputMaybe<Array<Scalars["String"]["input"]>>;
	title: Scalars["String"]["input"];
	totalAmount: Scalars["Float"]["input"];
	workspaceId: Scalars["String"]["input"];
	workspaceType: WorkspaceType;
};

export type CreateWorkspaceInput = {
	description: Scalars["String"]["input"];
	title: Scalars["String"]["input"];
	users?: InputMaybe<Array<WorkspaceUserInput>>;
};

export type Expense = {
	__typename?: "Expense";
	category?: Maybe<Scalars["String"]["output"]>;
	description?: Maybe<Scalars["String"]["output"]>;
	id: Scalars["ID"]["output"];
	installments?: Maybe<Installment>;
	nextDueDate?: Maybe<Scalars["Date"]["output"]>;
	payments?: Maybe<Array<Maybe<Payment>>>;
	recurrence?: Maybe<Recurrence>;
	tags?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
	title?: Maybe<Scalars["String"]["output"]>;
	totalAmount?: Maybe<Scalars["Float"]["output"]>;
};

export enum ExpenseStatus {
	Overdue = "OVERDUE",
	Paid = "PAID",
	Pending = "PENDING",
}

export type Installment = {
	__typename?: "Installment";
	amount?: Maybe<Scalars["Float"]["output"]>;
	current?: Maybe<Scalars["Int"]["output"]>;
	remaining?: Maybe<Scalars["Int"]["output"]>;
	total?: Maybe<Scalars["Int"]["output"]>;
};

export type InstallmentInput = {
	amount: Scalars["Float"]["input"];
	total: Scalars["Int"]["input"];
};

export type Mutation = {
	__typename?: "Mutation";
	_empty?: Maybe<Scalars["String"]["output"]>;
	createExpense?: Maybe<Expense>;
	createWorkspace?: Maybe<Workspace>;
	deleteWorkspace: Scalars["Boolean"]["output"];
	registerPayment: Expense;
	updateExpenseStatus: Expense;
	updateWorkspace?: Maybe<Workspace>;
};

export type MutationCreateExpenseArgs = {
	input: CreateExpenseInput;
};

export type MutationCreateWorkspaceArgs = {
	data: CreateWorkspaceInput;
};

export type MutationDeleteWorkspaceArgs = {
	id: Scalars["ID"]["input"];
	type: WorkspaceType;
};

export type MutationRegisterPaymentArgs = {
	expenseId: Scalars["ID"]["input"];
	input: PaymentInput;
	workspaceId: Scalars["ID"]["input"];
	workspaceType: WorkspaceType;
};

export type MutationUpdateExpenseStatusArgs = {
	id: Scalars["ID"]["input"];
	status: ExpenseStatus;
};

export type MutationUpdateWorkspaceArgs = {
	data: UpdateWorkspaceInput;
};

export type Payment = {
	__typename?: "Payment";
	amount?: Maybe<Scalars["Float"]["output"]>;
	dueDate?: Maybe<Scalars["Date"]["output"]>;
	id: Scalars["ID"]["output"];
	installmentNumber?: Maybe<Scalars["Int"]["output"]>;
	paidAt?: Maybe<Scalars["Date"]["output"]>;
	paymentProof?: Maybe<Scalars["String"]["output"]>;
	type?: Maybe<Scalars["String"]["output"]>;
};

export type PaymentInput = {
	amount?: InputMaybe<Scalars["Float"]["input"]>;
	id: Scalars["ID"]["input"];
};

export type Query = {
	__typename?: "Query";
	_empty?: Maybe<Scalars["String"]["output"]>;
	expense?: Maybe<Expense>;
	expenses: Array<Expense>;
	workspace?: Maybe<Workspace>;
	workspaces: Array<Workspace>;
};

export type QueryExpenseArgs = {
	expenseId: Scalars["ID"]["input"];
	workspaceId: Scalars["ID"]["input"];
	workspaceType: WorkspaceType;
};

export type QueryExpensesArgs = {
	workspaceId: Scalars["ID"]["input"];
	workspaceType: WorkspaceType;
};

export type QueryWorkspaceArgs = {
	id: Scalars["ID"]["input"];
	type: WorkspaceType;
};

export type Recurrence = {
	__typename?: "Recurrence";
	endDate?: Maybe<Scalars["Date"]["output"]>;
	interval: RecurrenceInterval;
	occurrences?: Maybe<Scalars["Int"]["output"]>;
	startDate?: Maybe<Scalars["Date"]["output"]>;
};

export type RecurrenceInput = {
	endDate?: InputMaybe<Scalars["Date"]["input"]>;
	interval: RecurrenceInterval;
	startDate?: InputMaybe<Scalars["Date"]["input"]>;
};

export enum RecurrenceInterval {
	Daily = "DAILY",
	Monthly = "MONTHLY",
	None = "NONE",
	Weekly = "WEEKLY",
	Yearly = "YEARLY",
}

export type UpdateWorkspaceInput = {
	description?: InputMaybe<Scalars["String"]["input"]>;
	id: Scalars["ID"]["input"];
	title?: InputMaybe<Scalars["String"]["input"]>;
	type: WorkspaceType;
	users?: InputMaybe<Array<WorkspaceUserInput>>;
};

export type Workspace = {
	__typename?: "Workspace";
	createdAt?: Maybe<Scalars["Date"]["output"]>;
	description?: Maybe<Scalars["String"]["output"]>;
	id: Scalars["ID"]["output"];
	title?: Maybe<Scalars["String"]["output"]>;
	type?: Maybe<Scalars["String"]["output"]>;
	updatedAt?: Maybe<Scalars["Date"]["output"]>;
	users?: Maybe<Array<Maybe<WorkspaceUser>>>;
};

export enum WorkspaceType {
	Personal = "PERSONAL",
	Shared = "SHARED",
}

export type WorkspaceUser = {
	__typename?: "WorkspaceUser";
	email?: Maybe<Scalars["String"]["output"]>;
	id: Scalars["ID"]["output"];
	name?: Maybe<Scalars["String"]["output"]>;
	role?: Maybe<WorkspaceUserRole>;
};

export type WorkspaceUserInput = {
	email: Scalars["String"]["input"];
	role: WorkspaceUserRole;
};

export enum WorkspaceUserRole {
	Editor = "EDITOR",
	Owner = "OWNER",
	Viewer = "VIEWER",
}

export type GetExpensesQueryVariables = Exact<{
	workspaceId: Scalars["ID"]["input"];
	workspaceType: WorkspaceType;
}>;

export type GetExpensesQuery = {
	__typename?: "Query";
	expenses: Array<{
		__typename?: "Expense";
		id: string;
		title?: string | null;
		description?: string | null;
		category?: string | null;
		totalAmount?: number | null;
		nextDueDate?: any | null;
		tags?: Array<string | null> | null;
		recurrence?: {
			__typename?: "Recurrence";
			interval: RecurrenceInterval;
			startDate?: any | null;
			endDate?: any | null;
			occurrences?: number | null;
		} | null;
		installments?: {
			__typename?: "Installment";
			current?: number | null;
			total?: number | null;
			remaining?: number | null;
			amount?: number | null;
		} | null;
		payments?: Array<{
			__typename?: "Payment";
			id: string;
			amount?: number | null;
			type?: string | null;
			dueDate?: any | null;
			installmentNumber?: number | null;
			paidAt?: any | null;
		} | null> | null;
	}>;
};

export type CreateExpenseMutationVariables = Exact<{
	createExpenseInput: CreateExpenseInput;
}>;

export type CreateExpenseMutation = {
	__typename?: "Mutation";
	createExpense?: {
		__typename?: "Expense";
		id: string;
		title?: string | null;
		description?: string | null;
		category?: string | null;
		totalAmount?: number | null;
		nextDueDate?: any | null;
		tags?: Array<string | null> | null;
		recurrence?: {
			__typename?: "Recurrence";
			interval: RecurrenceInterval;
			startDate?: any | null;
			endDate?: any | null;
			occurrences?: number | null;
		} | null;
		installments?: {
			__typename?: "Installment";
			current?: number | null;
			total?: number | null;
			remaining?: number | null;
			amount?: number | null;
		} | null;
		payments?: Array<{
			__typename?: "Payment";
			id: string;
			amount?: number | null;
			type?: string | null;
			dueDate?: any | null;
			installmentNumber?: number | null;
			paidAt?: any | null;
		} | null> | null;
	} | null;
};

export type GetWorkspacesQueryVariables = Exact<{ [key: string]: never }>;

export type GetWorkspacesQuery = {
	__typename?: "Query";
	workspaces: Array<{
		__typename?: "Workspace";
		id: string;
		title?: string | null;
		description?: string | null;
		type?: string | null;
		createdAt?: any | null;
		updatedAt?: any | null;
		users?: Array<{
			__typename?: "WorkspaceUser";
			id: string;
			name?: string | null;
			email?: string | null;
			role?: WorkspaceUserRole | null;
		} | null> | null;
	}>;
};

export type GetWorkspaceByIdQueryVariables = Exact<{
	id: Scalars["ID"]["input"];
	type: WorkspaceType;
}>;

export type GetWorkspaceByIdQuery = {
	__typename?: "Query";
	workspace?: {
		__typename?: "Workspace";
		id: string;
		title?: string | null;
		description?: string | null;
		type?: string | null;
		createdAt?: any | null;
		updatedAt?: any | null;
		users?: Array<{
			__typename?: "WorkspaceUser";
			id: string;
			name?: string | null;
			email?: string | null;
			role?: WorkspaceUserRole | null;
		} | null> | null;
	} | null;
};

export type CreateWorkspaceMutationVariables = Exact<{
	data: CreateWorkspaceInput;
}>;

export type CreateWorkspaceMutation = {
	__typename?: "Mutation";
	createWorkspace?: {
		__typename?: "Workspace";
		id: string;
		title?: string | null;
		description?: string | null;
		type?: string | null;
		createdAt?: any | null;
		updatedAt?: any | null;
		users?: Array<{
			__typename?: "WorkspaceUser";
			id: string;
			name?: string | null;
			email?: string | null;
			role?: WorkspaceUserRole | null;
		} | null> | null;
	} | null;
};

export const GetExpensesDocument = gql`
    query GetExpenses($workspaceId: ID!, $workspaceType: WorkspaceType!) {
  expenses(workspaceId: $workspaceId, workspaceType: $workspaceType) {
    id
    title
    description
    category
    totalAmount
    nextDueDate
    recurrence {
      interval
      startDate
      endDate
      occurrences
    }
    installments {
      current
      total
      remaining
      amount
    }
    payments {
      id
      amount
      type
      dueDate
      installmentNumber
      paidAt
    }
    tags
  }
}
    `;
export const CreateExpenseDocument = gql`
    mutation CreateExpense($createExpenseInput: CreateExpenseInput!) {
  createExpense(input: $createExpenseInput) {
    id
    title
    description
    category
    totalAmount
    nextDueDate
    recurrence {
      interval
      startDate
      endDate
      occurrences
    }
    installments {
      current
      total
      remaining
      amount
    }
    payments {
      id
      amount
      type
      dueDate
      installmentNumber
      paidAt
    }
    tags
  }
}
    `;
export const GetWorkspacesDocument = gql`
    query GetWorkspaces {
  workspaces {
    id
    title
    description
    type
    users {
      id
      name
      email
      role
    }
    createdAt
    updatedAt
  }
}
    `;
export const GetWorkspaceByIdDocument = gql`
    query GetWorkspaceById($id: ID!, $type: WorkspaceType!) {
  workspace(id: $id, type: $type) {
    id
    title
    description
    type
    users {
      id
      name
      email
      role
    }
    createdAt
    updatedAt
  }
}
    `;
export const CreateWorkspaceDocument = gql`
    mutation CreateWorkspace($data: CreateWorkspaceInput!) {
  createWorkspace(data: $data) {
    id
    title
    description
    type
    users {
      id
      name
      email
      role
    }
    createdAt
    updatedAt
  }
}
    `;
