import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { successResponse } from "../models/responseModel";
import { AppError } from "../errors/errors";

export interface Loan {
    id: string;
    applicantId: string;
    amount: number;
    status: string;
    risk: string;
}

// sample data
export const loans: Loan[] = [
    {
        id: "loan_123",
        applicantId: "user_abc",
        amount: 10000,
        status: "submitted",
        risk: "high",
    }
];

/**
 * Manages requests, responses, and creation of a Loan
 */
export const createLoan = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Extract expected fields from the request
        const applicantId: string = req.body.applicantId;
        const amount: number = req.body.amount;
        const risk: string = req.body.risk;

        const id: string = `loan_${Date.now()}`;
        const newLoan: Loan = {
            id,
            applicantId: applicantId || "user_abc",
            amount: typeof amount === "number" ? amount : 10000,
            status: "submitted",
            risk: risk || "high",
        };

        loans.push(newLoan);

        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newLoan, "Loan application created successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to mark a loan as under review
 */
export const reviewLoan = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;

        const loan: Loan | undefined = loans.find((loan) => loan.id === id);
        if (!loan) {
            return next(new AppError("Loan not found", "LOAN_NOT_FOUND", HTTP_STATUS.NOT_FOUND));
        }

        loan.status = "under_review";

        res.status(HTTP_STATUS.OK).json(
            successResponse(loan, "Loan sent for review")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to retrieve all Loans
 */
export const getAllLoans = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        res.status(HTTP_STATUS.OK).json(
            successResponse(loans, "Loans retrieved successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to approve a Loan
 */
export const approveLoan = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;

        const loan: Loan | undefined = loans.find((loan) => loan.id === id);
        if (!loan) {
            return next(new AppError("Loan not found", "LOAN_NOT_FOUND", HTTP_STATUS.NOT_FOUND));
        }

        loan.status = "approved";

        res.status(HTTP_STATUS.OK).json(
            successResponse(loan, "Loan approved successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to retrieve a single Loan by id
 */
export const getLoanById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;

        const loan: Loan | undefined = loans.find((loan) => loan.id === id);
        if (!loan) {
            return next(new AppError("Loan not found", "LOAN_NOT_FOUND", HTTP_STATUS.NOT_FOUND));
        }

        res.status(HTTP_STATUS.OK).json(
            successResponse(loan, "Loan retrieved successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to update a Loan
 */
export const updateLoan = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;
        const { amount, status } = req.body;

        const loan: Loan | undefined = loans.find((loan) => loan.id === id);
        if (!loan) {
            return next(new AppError("Loan not found", "LOAN_NOT_FOUND", HTTP_STATUS.NOT_FOUND));
        }

        if (typeof amount === "number") loan.amount = amount;
        if (typeof status === "string") loan.status = status as string;

        res.status(HTTP_STATUS.OK).json(
            successResponse(loan, "Loan updated successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to delete a Loan
 */
export const deleteLoan = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;

        const loanId: number = loans.findIndex((loan) => loan.id === id);
        if (loanId === -1) {
            return next(new AppError("Loan not found", "LOAN_NOT_FOUND", HTTP_STATUS.NOT_FOUND));
        }

        loans.splice(loanId, 1);

        res.status(HTTP_STATUS.OK).json(
            successResponse({ id }, "Loan deleted successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};
