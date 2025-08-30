import { Product, Report } from "@shared/schema";

export interface PDFReportData {
  product: Product;
  report: Report;
  questions: Array<{
    questionText: string;
    response: string;
  }>;
}

export async function generatePDFReport(data: PDFReportData): Promise<Buffer> {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const reportData = data.report.reportData as any;
  const recommendations = reportData?.recommendations || [];
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Product Transparency Report - ${data.product.name}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: white;
        }
        
        .header {
            text-align: center;
            border-bottom: 3px solid #1B5E20;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .logo {
            color: #1B5E20;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .title {
            font-size: 32px;
            font-weight: bold;
            color: #1B5E20;
            margin: 20px 0;
        }
        
        .subtitle {
            font-size: 18px;
            color: #666;
            margin-bottom: 10px;
        }
        
        .score-section {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin: 30px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 12px;
        }
        
        .score-box {
            text-align: center;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            min-width: 120px;
        }
        
        .score-value {
            font-size: 36px;
            font-weight: bold;
            color: #00C853;
            margin-bottom: 5px;
        }
        
        .health-score {
            color: #1B5E20;
        }
        
        .score-label {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
        }
        
        .section {
            margin: 30px 0;
            page-break-inside: avoid;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #1B5E20;
            margin-bottom: 15px;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 5px;
        }
        
        .product-info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
        }
        
        .info-item {
            padding: 12px;
            background: #f8f9fa;
            border-radius: 6px;
        }
        
        .info-label {
            font-weight: 600;
            color: #333;
            font-size: 14px;
            margin-bottom: 4px;
        }
        
        .info-value {
            color: #666;
            font-size: 14px;
        }
        
        .highlight-item {
            display: flex;
            align-items: flex-start;
            margin: 12px 0;
            padding: 8px 0;
        }
        
        .highlight-bullet {
            width: 8px;
            height: 8px;
            background: #00C853;
            border-radius: 50%;
            margin-right: 12px;
            margin-top: 6px;
            flex-shrink: 0;
        }
        
        .question-item {
            margin: 20px 0;
            padding: 15px;
            background: #f9f9f9;
            border-left: 4px solid #1B5E20;
            border-radius: 0 6px 6px 0;
            page-break-inside: avoid;
        }
        
        .question-text {
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
            font-size: 15px;
        }
        
        .question-response {
            color: #666;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .analysis-section {
            background: #f0f7ff;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #1565C0;
            margin: 20px 0;
        }
        
        .recommendations-section {
            background: #f1f8e9;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #2E7D32;
            margin: 20px 0;
        }
        
        .recommendation-item {
            margin: 10px 0;
            padding-left: 20px;
            position: relative;
        }
        
        .recommendation-item::before {
            content: "→";
            position: absolute;
            left: 0;
            color: #2E7D32;
            font-weight: bold;
        }
        
        .certifications-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            margin: 15px 0;
        }
        
        .certification-badge {
            display: inline-flex;
            align-items: center;
            padding: 6px 12px;
            background: #e8f5e8;
            color: #2e7d32;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .certification-badge.inactive {
            background: #f5f5f5;
            color: #999;
        }
        
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        
        .report-id {
            font-family: 'Courier New', monospace;
            background: #f0f0f0;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: 600;
        }
        
        .watermark {
            position: fixed;
            bottom: 20px;
            right: 20px;
            opacity: 0.1;
            font-size: 48px;
            font-weight: bold;
            color: #1B5E20;
            z-index: -1;
            transform: rotate(-45deg);
        }
        
        @media print {
            .score-section {
                break-inside: avoid;
            }
            
            .section {
                break-inside: avoid;
            }
            
            .question-item {
                break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="watermark">ALTIBBE</div>
    
    <div class="header">
        <div class="logo">Altibbe</div>
        <h1 class="title">Product Transparency Report</h1>
        <div class="subtitle">${data.product.name}</div>
        <p>Generated on ${currentDate}</p>
    </div>
    
    <div class="score-section">
        <div class="score-box">
            <div class="score-value">${data.report.transparencyScore || 0}</div>
            <div class="score-label">Transparency Score</div>
        </div>
        <div class="score-box">
            <div class="score-value health-score">${data.report.healthScore || 'N/A'}</div>
            <div class="score-label">Health Rating</div>
        </div>
    </div>
    
    <div class="section">
        <h2 class="section-title">Executive Summary</h2>
        <div class="analysis-section">
            <p><strong>Assessment Overview:</strong> ${reportData?.analysis || 'This product has undergone comprehensive transparency assessment through our AI-powered evaluation system.'}</p>
        </div>
    </div>
    
    <div class="section">
        <h2 class="section-title">Product Information</h2>
        <div class="product-info-grid">
            <div class="info-item">
                <div class="info-label">Product Name</div>
                <div class="info-value">${data.product.name}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Category</div>
                <div class="info-value">${data.product.category}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Target Audience</div>
                <div class="info-value">${data.product.audience || 'General Public'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Manufacturing Location</div>
                <div class="info-value">${data.product.location || 'Not specified'}</div>
            </div>
        </div>
        
        ${data.product.description ? `
        <div style="margin-top: 20px;">
            <div class="info-label">Product Description</div>
            <p style="margin-top: 8px; padding: 12px; background: #f8f9fa; border-radius: 6px; font-size: 14px;">${data.product.description}</p>
        </div>
        ` : ''}
        
        ${data.product.certifications ? `
        <div style="margin-top: 20px;">
            <div class="info-label">Certifications</div>
            <div class="certifications-grid">
                ${Object.entries(data.product.certifications).map(([cert, value]) => 
                    `<span class="certification-badge ${value ? '' : 'inactive'}">${cert.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>`
                ).join('')}
            </div>
        </div>
        ` : ''}
    </div>
    
    ${data.report.highlights && data.report.highlights.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Key Transparency Highlights</h2>
        ${data.report.highlights.map(highlight => `
            <div class="highlight-item">
                <div class="highlight-bullet"></div>
                <span>${highlight}</span>
            </div>
        `).join('')}
    </div>
    ` : ''}
    
    ${data.questions.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Detailed Assessment Responses</h2>
        ${data.questions.map((q, index) => `
            <div class="question-item">
                <div class="question-text">${index + 1}. ${q.questionText}</div>
                <div class="question-response">${q.response || 'No response provided'}</div>
            </div>
        `).join('')}
    </div>
    ` : ''}
    
    ${recommendations.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Recommendations for Improvement</h2>
        <div class="recommendations-section">
            ${recommendations.map((rec: string) => `
                <div class="recommendation-item">${rec}</div>
            `).join('')}
        </div>
    </div>
    ` : ''}
    
    <div class="section">
        <h2 class="section-title">Report Methodology</h2>
        <p style="font-size: 14px; color: #666; line-height: 1.6;">
            This transparency report was generated using Altibbe's AI-powered assessment platform. The evaluation process combines automated data analysis with expert-designed questionnaires tailored to specific product categories and target audiences. Transparency scores reflect the completeness and quality of information provided, while health scores assess safety and regulatory compliance based on current industry standards.
        </p>
        
        <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px;">
            <p style="margin: 0; font-size: 13px; color: #856404;"><strong>Disclaimer:</strong> This report is based on information provided by the product manufacturer and AI analysis. It should be used as a guide for transparency assessment and does not constitute medical, legal, or regulatory advice. Consumers should always consult with healthcare professionals for product safety concerns.</p>
        </div>
    </div>
    
    <div class="footer">
        <p>Report ID: <span class="report-id">${data.report.id}</span></p>
        <p style="margin: 10px 0;">Generated by Altibbe Product Transparency Platform</p>
        <p style="margin: 0; font-weight: 600;">Health • Wisdom • Virtue</p>
    </div>
</body>
</html>
  `;

  // Return HTML as buffer - in production, this would be converted to PDF using a proper library like puppeteer
  // For demonstration purposes, this returns the HTML content
  return Buffer.from(htmlContent, 'utf-8');
}

export async function generateSampleReport(): Promise<Buffer> {
  const sampleData: PDFReportData = {
    product: {
      id: 'sample-1',
      userId: null,
      name: 'Healthy Kids Crackers',
      category: 'Food & Beverages',
      audience: 'Children',
      description: 'Organic whole wheat crackers made with locally sourced ingredients, designed for health-conscious families. No artificial preservatives, colors, or flavors. Made in small batches to ensure freshness and quality.',
      location: 'Portland, Oregon, USA',
      certifications: {
        organic: true,
        nonGmo: false,
        fairTrade: true
      },
      basicInfo: {},
      aiResponses: {},
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    report: {
      id: 'TPR-2024-001',
      productId: 'sample-1',
      transparencyScore: 92,
      healthScore: 'A+',
      highlights: [
        '100% Organic Certified Ingredients',
        '75% Locally Sourced Materials (within 200 miles)',
        'Zero Artificial Preservatives or Colors',
        'Child-Safe Manufacturing Environment',
        'Fair Trade Certified Supply Chain',
        'Comprehensive Allergen Management System'
      ],
      pdfUrl: null,
      reportData: {
        analysis: 'This product demonstrates exceptional transparency with comprehensive ingredient disclosure, ethical sourcing practices, and strong safety protocols for its target demographic.',
        recommendations: [
          'Consider obtaining Non-GMO Project Verification to enhance consumer confidence',
          'Implement QR code linking to live transparency dashboard for real-time updates',
          'Explore carbon-neutral shipping options to improve environmental profile'
        ]
      },
      generatedAt: new Date()
    },
    questions: [
      {
        questionText: 'What percentage of your ingredients are sourced locally (within 200 miles)?',
        response: '75% - We work directly with local farms in Oregon and Washington for our primary wheat, seeds, and oils. Only our sea salt is sourced from California.'
      },
      {
        questionText: 'Are there any common allergens present in your manufacturing facility?',
        response: 'Our facility also processes milk and soy products. We follow strict cleaning protocols between batches, conduct regular allergen testing, and maintain separate production lines for allergen-free products.'
      },
      {
        questionText: 'What specific measures do you take to ensure product safety for children?',
        response: 'We follow enhanced safety protocols including: child-resistant packaging design review, reduced sodium formulation (50% less than standard crackers), choking hazard assessment for size and texture, and third-party safety testing for all ingredients.'
      },
      {
        questionText: 'How do you verify the organic status of your ingredients throughout the supply chain?',
        response: 'We maintain direct relationships with certified organic farms, require USDA organic certificates for all suppliers, conduct quarterly on-site audits, and use blockchain technology to track ingredients from farm to package.'
      }
    ]
  };

  return generatePDFReport(sampleData);
}
