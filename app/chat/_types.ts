export type Templates = {
  id: number;
  name: string;
  description: string;
}[];

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
  loading: boolean;
};

export type CategoryItem = {
  id: string;
  name: string;
  category?: string;
  link?: string;
};

//prettier-ignore
export type RequestBody = {
  question: string;
  usecase: "knowledge" | "business";
  index:
    //UC1
    | "credit_card"
    | "mortgage"
    | "auto_loan"
    | "investment"
    //UC2
    | "credit_express_card"
    | "loan"
    | "deposit"
    | "customer";
};
