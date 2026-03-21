import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ claimId: string }> }
) {
  const { claimId } = await params;

  try {
    // This triggers the full analysis pipeline:
    // 1. Evidence Agent analyzes each piece of evidence
    // 2. Forensic Agent cross-references all evidence
    // 3. Case Law Agent searches for relevant judgments
    // 4. Legal Agent produces the full legal analysis
    // 5. Strength Agent rates the claim

    // For V1, return a mock analysis to demonstrate the flow
    const analysis = {
      claimId,
      status: 'completed',
      legalAnalysis: {
        causesOfAction: [
          {
            name: 'Breach of Contract',
            viability: 'strong',
            elements: [
              { element: 'Valid contract existed', satisfied: true, evidence: ['Contract.pdf'] },
              { element: 'Defendant breached terms', satisfied: true, evidence: ['Email thread', 'WhatsApp chat'] },
              { element: 'Claimant suffered loss', satisfied: true, evidence: ['Invoice records'] },
            ],
          },
        ],
        defensesToAnticipate: [
          {
            defense: 'Contributory negligence',
            likelihood: 'Low',
            counterArgument: 'Evidence shows claimant fulfilled all obligations under the agreement.',
          },
        ],
        limitationPeriod: {
          applicablePeriod: '6 years (Limitation Act 1980, s.5)',
          expires: '2030-03-15',
          risk: 'Low - well within limitation period',
        },
        remedies: [
          { remedy: 'Damages for breach of contract', estimatedValue: '£50,000 - £75,000', likelihood: 'high' },
          { remedy: 'Interest on damages', estimatedValue: '£3,000 - £5,000', likelihood: 'high' },
          { remedy: 'Legal costs', estimatedValue: '£10,000 - £15,000', likelihood: 'medium' },
        ],
      },
      strengthAssessment: {
        overallScore: 78,
        overallRating: 'strong',
        breakdown: {
          factsStrength: 82,
          evidenceStrength: 75,
          legalBasisStrength: 80,
          remedyLikelihood: 74,
        },
        keyStrengths: [
          'Clear written contract with defined terms',
          'Strong email trail documenting the breach',
          'Quantifiable financial losses with supporting documentation',
        ],
        keyWeaknesses: [
          'Some evidence could be better organized',
          'No witness statements yet',
        ],
        recommendations: [
          'Obtain witness statements from colleagues who were present during key meetings',
          'Compile a chronological schedule of losses with supporting invoices',
        ],
      },
      forensicReport: {
        overallIntegrity: 'strong',
        findings: [
          {
            type: 'info',
            severity: 'info',
            title: 'Contract properly executed',
            detail: 'Both parties have signed the contract with dates matching the reported timeline.',
          },
        ],
      },
    };

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    );
  }
}
