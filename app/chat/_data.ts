import { type CategoryItem, Templates } from "./_types";

export const categoryItems: CategoryItem[] = [
  { id: "enterprise", name: "Enterprise" },
  { id: "business", name: "Business" },
];

export const externalItems: CategoryItem[] = [
  { id: "technical_metadata", name: "Technical Metadata", link: "https://www.google.com/" },
  { id: "data_query", name: "Data Query", link: "https://www.google.com/" },
]

export const subCategoryItems: CategoryItem[] = [
  { id: "credit_card", name: "Credit Card", category: "enterprise" },
  { id: "mortgage", name: "Mortgage", category: "enterprise" },
  { id: "auto_loan", name: "Auto Loan", category: "enterprise" },
  { id: "investment", name: "Investment", category: "enterprise" },
  {
    id: "credit_card_and_express_cash_card_curation",
    name: "Credit Card & Express Cash Card Curation",
    category: "business",
  },
  { id: "loan_curation", name: "Loan Curation", category: "business" },
  { id: "deposit_curation", name: "Deposit Curation", category: "business" },
  {
    id: "customer_curation",
    name: "Customer Curation",
    category: "business",
  },
];

export const toolTipContents = [
  {
    categoryId: "enterprise",
    content: `● Credit Card 
    - Product Manual (Card Payment Option, Card Benefits, Interest rate calculation example) 
    - Product disclosure (Interest rate per card, Credit Card Fee per card) 
    ● Mortgage 
    - Sale Sheet (Product Information, Interest rate calculation example, House Insurance) 
    ● Auto Loan 
    - Sale Sheet (Product Information, Interest rate calculation example, Auto Insurance) 
    ● Investment 
    - Fund Fact Sheet (Fund Information, Historical Performance, Management Fee) 
    ⏹ K-Star
    ⏹ K-change
    ⏹ K-Vietnam
    `
  },
  {
    categoryId: "business",
    content:     `● Credit Card & Express Cash Card Curation 
    - Account Profile 
    - Transaction 
    - Acquiring Transaction 
    - Smartpay Profile & Transaction 
    ● Loan Curation 
    - Loan Account Master 
    ● Deposit Curation 
    - Deposit Account Profile 
    - Fixed Deposit Sub Account Profile 
    - OD Limit Profile 
    ● Customer Curation (CRM) 
    - Customer Product Profile 
    - Customer Product Holding Profile
    `
  }
];
