import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MpesaService {
  private readonly logger = new Logger(MpesaService.name);

  constructor(private readonly configService: ConfigService) {}

  async initiatePayment(phoneNumber: string, amount: number, reference: string) {
    const apiKey = this.configService.get<string>('MPESA_API_KEY');
    const secret = this.configService.get<string>('MPESA_SECRET');
    const environment = this.configService.get<string>('MPESA_ENVIRONMENT') || 'sandbox';

    try {
      // M-Pesa API endpoint based on environment
      const apiUrl = environment === 'production' 
        ? 'https://api.m-pesa.co.mz/v1' 
        : 'https://sandbox.m-pesa.co.mz/v1';

      const response = await axios.post(`${apiUrl}/payment/request`, {
        input_Amount: amount,
        input_Country: 'MZ',
        input_Currency: 'MZN',
        input_CustomerMSISDN: phoneNumber,
        input_ServiceProviderCode: '000000', // Default for M-Pesa
        input_TransactionReference: reference,
        input_ThirdPartyConversationID: this.generateConversationId(),
        input_PurchasedItemsDesc: 'Pagamento AprendiMoz',
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 seconds timeout
      });

      this.logger.log(`M-Pesa payment initiated: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error initiating M-Pesa payment: ${error.message}`, error.stack);
      throw new Error(`Failed to initiate M-Pesa payment: ${error.message}`);
    }
  }

  async checkTransactionStatus(transactionId: string) {
    const apiKey = this.configService.get<string>('MPESA_API_KEY');
    const environment = this.configService.get<string>('MPESA_ENVIRONMENT') || 'sandbox';

    try {
      const apiUrl = environment === 'production' 
        ? 'https://api.m-pesa.co.mz/v1' 
        : 'https://sandbox.m-pesa.co.mz/v1';

      const response = await axios.get(`${apiUrl}/transaction/status/${transactionId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      this.logger.log(`M-Pesa transaction status: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error checking M-Pesa transaction status: ${error.message}`, error.stack);
      throw new Error(`Failed to check transaction status: ${error.message}`);
    }
  }

  async processCallback(callbackData: any) {
    this.logger.log(`M-Pesa callback received: ${JSON.stringify(callbackData)}`);

    try {
      // Validate callback signature
      const isValid = this.validateCallbackSignature(callbackData);
      if (!isValid) {
        throw new Error('Invalid callback signature');
      }

      // Process the callback based on transaction status
      const { output_ResponseCode, output_TransactionID, output_ResponseDesc } = callbackData;

      if (output_ResponseCode === 'INS-0') {
        // Success
        this.logger.log(`Payment successful: ${output_TransactionID}`);
        return {
          success: true,
          transactionId: output_TransactionID,
          status: 'completed',
          message: 'Payment processed successfully',
        };
      } else {
        // Failed
        this.logger.error(`Payment failed: ${output_ResponseDesc} (${output_ResponseCode})`);
        return {
          success: false,
          transactionId: output_TransactionID,
          status: 'failed',
          message: output_ResponseDesc || 'Payment failed',
        };
      }
    } catch (error) {
      this.logger.error(`Error processing M-Pesa callback: ${error.message}`, error.stack);
      throw new Error(`Failed to process callback: ${error.message}`);
    }
  }

  async refundTransaction(transactionId: string, amount: number, reason: string) {
    const apiKey = this.configService.get<string>('MPESA_API_KEY');
    const environment = this.configService.get<string>('MPESA_ENVIRONMENT') || 'sandbox';

    try {
      const apiUrl = environment === 'production' 
        ? 'https://api.m-pesa.co.mz/v1' 
        : 'https://sandbox.m-pesa.co.mz/v1';

      const response = await axios.post(`${apiUrl}/payment/reverse`, {
        input_TransactionID: transactionId,
        input_Amount: amount,
        input_ReversalReason: reason,
        input_ThirdPartyConversationID: this.generateConversationId(),
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      this.logger.log(`M-Pesa refund initiated: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error initiating M-Pesa refund: ${error.message}`, error.stack);
      throw new Error(`Failed to initiate refund: ${error.message}`);
    }
  }

  private generateConversationId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `${timestamp}_${random}`;
  }

  private validateCallbackSignature(callbackData: any): boolean {
    // In production, you should validate the signature
    // For now, we'll skip validation in sandbox mode
    const environment = this.configService.get<string>('MPESA_ENVIRONMENT') || 'sandbox';
    
    if (environment === 'sandbox') {
      return true; // Skip validation in sandbox
    }

    // Production signature validation would go here
    // This involves checking the output_SignedData field against your secret key
    return true; // Placeholder
  }

  // Helper method to format phone number for M-Pesa
  formatPhoneNumber(phoneNumber: string): string {
    // Remove any non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Ensure it starts with country code for Mozambique (+258)
    if (!cleaned.startsWith('258')) {
      if (cleaned.startsWith('8')) {
        return `258${cleaned.substring(1)}`;
      }
      return `258${cleaned}`;
    }
    
    return cleaned;
  }

  // Method to get transaction fees
  getTransactionFees(amount: number): { fee: number; total: number } {
    // M-Pesa typically charges a percentage fee
    const feePercentage = 0.02; // 2%
    const fee = Math.ceil(amount * feePercentage);
    const total = amount + fee;
    
    return { fee, total };
  }

  // Method to validate phone number
  validatePhoneNumber(phoneNumber: string): { isValid: boolean; formatted?: string } {
    const formatted = this.formatPhoneNumber(phoneNumber);
    
    // M-Pesa phone numbers should be 9 digits (including country code)
    if (formatted.length !== 12) {
      return { isValid: false };
    }
    
    // Should start with 258 (Mozambique country code)
    if (!formatted.startsWith('258')) {
      return { isValid: false };
    }
    
    return { isValid: true, formatted };
  }

  // Method to generate unique transaction reference
  generateTransactionReference(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `APRENDI${timestamp}${random}`;
  }
}
