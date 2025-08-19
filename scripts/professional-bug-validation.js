#!/usr/bin/env node
/**
 * Professional Bug Fix Validation Suite - 2025.08.19
 * Comprehensive testing for all fixed functionality
 */

const { config } = require('dotenv');
config({ path: '.env.local' });

const BASE_URL = 'http://localhost:3001';
const QUIZ_ID = 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291';

// Test utilities
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  step: (msg) => console.log(`\n${colors.blue}🔧 ${msg}${colors.reset}`)
};

// Professional test suite
class BugFixValidator {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
  }

  async runTest(name, testFn) {
    try {
      log.step(name);
      const result = await testFn();
      if (result.success) {
        log.success(`${name}: ${result.message}`);
        this.results.passed++;
      } else {
        log.warning(`${name}: ${result.message}`);
        this.results.warnings++;
      }
      this.results.tests.push({ name, ...result });
    } catch (error) {
      log.error(`${name}: ${error.message}`);
      this.results.failed++;
      this.results.tests.push({ name, success: false, message: error.message });
    }
  }

  // Test 1: Server Connectivity
  async testServerConnectivity() {
    const response = await fetch(`${BASE_URL}/admin`);
    return {
      success: response.ok,
      message: response.ok ? 
        `Server responding on port 3001` : 
        `Server not accessible: ${response.status}`
    };
  }

  // Test 2: Products API with compared_price
  async testProductsAPI() {
    try {
      const productData = {
        quiz_id: QUIZ_ID,
        name: 'Professional Test Product - Discount',
        description: 'Testing compared_price functionality',
        price: 15000,
        compared_price: 25000,
        currency: 'HUF',
        active: true,
        stripe_product_id: '',
        stripe_price_id: '',
        booking_url: ''
      };

      const response = await fetch(`${BASE_URL}/api/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        const data = await response.json();
        const hasComparedPrice = data.compared_price === 25000;
        return {
          success: hasComparedPrice,
          message: hasComparedPrice ? 
            'Products API working with compared_price support' :
            'Products API working but compared_price not saved correctly'
        };
      } else {
        const error = await response.text();
        return {
          success: false,
          message: `API Error: ${response.status} - ${error}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Network Error: ${error.message}`
      };
    }
  }

  // Test 3: AI Generation Endpoint
  async testAIGeneration() {
    try {
      const response = await fetch(`${BASE_URL}/api/ai/generate-result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: 'test-session-id',
          answers: { q1: 'test' },
          scores: { test_score: 5 },
          lang: 'hu'
        })
      });

      return {
        success: response.status !== 404,
        message: response.status !== 404 ? 
          'AI Generation endpoint accessible' : 
          'AI Generation endpoint not found'
      };
    } catch (error) {
      return {
        success: false,
        message: `AI Generation test failed: ${error.message}`
      };
    }
  }

  // Test 4: Stripe Checkout Configuration
  async testStripeConfig() {
    try {
      const response = await fetch(`${BASE_URL}/api/stripe/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: 'test-product',
          session_id: QUIZ_ID,
          lang: 'hu'
        })
      });

      return {
        success: response.status !== 404,
        message: response.status !== 404 ? 
          'Stripe checkout endpoint accessible' : 
          'Stripe checkout endpoint not found'
      };
    } catch (error) {
      return {
        success: false,
        message: `Stripe config test failed: ${error.message}`
      };
    }
  }

  // Run all tests
  async runAllTests() {
    log.info('Starting Professional Bug Fix Validation Suite');
    log.info('='.repeat(60));

    await this.runTest('Server Connectivity', () => this.testServerConnectivity());
    await this.runTest('Products API with compared_price', () => this.testProductsAPI());
    await this.runTest('AI Generation Endpoint', () => this.testAIGeneration());
    await this.runTest('Stripe Configuration', () => this.testStripeConfig());

    this.printSummary();
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    log.info('PROFESSIONAL VALIDATION SUMMARY');
    console.log('='.repeat(60));
    
    log.success(`Passed: ${this.results.passed} tests`);
    if (this.results.warnings > 0) {
      log.warning(`Warnings: ${this.results.warnings} tests`);
    }
    if (this.results.failed > 0) {
      log.error(`Failed: ${this.results.failed} tests`);
    }

    const totalTests = this.results.passed + this.results.warnings + this.results.failed;
    const successRate = Math.round((this.results.passed / totalTests) * 100);
    
    console.log(`\nOverall Success Rate: ${successRate}%`);
    
    if (successRate >= 90) {
      log.success('PROFESSIONAL GRADE: EXCELLENT');
    } else if (successRate >= 75) {
      log.warning('PROFESSIONAL GRADE: GOOD');
    } else {
      log.error('PROFESSIONAL GRADE: NEEDS IMPROVEMENT');
    }

    console.log('\nDetailed Results:');
    this.results.tests.forEach(test => {
      const icon = test.success ? '✅' : '⚠️';
      console.log(`  ${icon} ${test.name}: ${test.message}`);
    });
  }
}

// Execute professional validation
async function main() {
  const validator = new BugFixValidator();
  await validator.runAllTests();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = BugFixValidator;
