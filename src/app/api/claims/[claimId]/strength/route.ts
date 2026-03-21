import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ claimId: string }> }
) {
  const { claimId } = await params;

  // For V1, return a demo strength assessment
  // In production, this will pull from the database after the analysis pipeline runs
  const strength = {
    claimId,
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
      'No witness statements yet obtained',
    ],
    recommendations: [
      'Obtain witness statements from colleagues who were present during key meetings',
      'Compile a chronological schedule of losses with supporting invoices',
      'Consider obtaining expert evidence on the standard of work expected',
    ],
    remedies: [
      { remedy: 'Damages for breach of contract', estimatedValue: '£50,000 - £75,000', likelihood: 'high' },
      { remedy: 'Interest on damages (8% statutory)', estimatedValue: '£3,000 - £5,000', likelihood: 'high' },
      { remedy: 'Legal costs recovery', estimatedValue: '£10,000 - £15,000', likelihood: 'medium' },
    ],
    costBenefit: {
      estimatedLegalCosts: '£5,000 - £15,000 (depending on complexity and whether case settles)',
      estimatedRecovery: '£63,000 - £95,000 (including interest and costs)',
      recommendation: 'The potential recovery significantly outweighs the estimated costs. Proceeding with the claim is commercially viable.',
    },
    limitationPeriod: {
      applicablePeriod: '6 years from date of breach (Limitation Act 1980, s.5)',
      estimatedExpiry: '2030-03-15',
      risk: 'Low - well within limitation period. However, early action is recommended to preserve evidence.',
    },
  };

  return NextResponse.json(strength);
}
