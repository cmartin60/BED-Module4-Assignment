import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import * as loanController from "../src/api/v1/controllers/loanController";
import { AppError } from "../src/api/v1/errors/errors";

describe("Loan Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = { params: {}, body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe("createLoan", () => {
    it("should handle successful creation", async () => {
      mockReq.body = { applicantId: "user_abc", amount: 5000, risk: "high" };

      await loanController.createLoan(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          data: expect.objectContaining({
            applicantId: "user_abc",
            amount: 5000,
            risk: "high",
            status: "submitted",
          }),
        })
      );
    });
  });

  describe("getAllLoans", () => {
    it("should return all loans", async () => {
      await loanController.getAllLoans(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          data: expect.any(Array),
        })
      );
    });
  });

  describe("getLoanById", () => {
    it("should return a loan if found", async () => {
      mockReq.params = { id: "loan_123" };

      await loanController.getLoanById(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          data: expect.objectContaining({ id: "loan_123" }),
        })
      );
    });

    it("should call next with AppError if not found", async () => {
      mockReq.params = { id: "not_found" };

      await loanController.getLoanById(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.any(AppError)
      );
    });
  });

  describe("updateLoan", () => {
    it("should update a loan if found", async () => {
      mockReq.params = { id: "loan_123" };
      mockReq.body = { amount: 9999, status: "approved" };

      await loanController.updateLoan(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          data: expect.objectContaining({ amount: 9999, status: "approved" }),
        })
      );
    });

    it("should call next with AppError if not found", async () => {
      mockReq.params = { id: "not_found" };
      mockReq.body = { amount: 123 };

      await loanController.updateLoan(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  describe("deleteLoan", () => {
    it("should delete a loan if found", async () => {
      // Add a loan to delete
      const loanToDelete = {
        id: "loan_delete",
        applicantId: "user_del",
        amount: 100,
        status: "submitted",
        risk: "high",
      };
      (loanController.loans as any[]).push(loanToDelete);

      mockReq.params = { id: "loan_delete" };

      await loanController.deleteLoan(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          data: expect.objectContaining({ id: "loan_delete" }),
        })
      );
    });

    it("should call next with AppError if not found", async () => {
      mockReq.params = { id: "not_found" };

      await loanController.deleteLoan(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });
  });
});
