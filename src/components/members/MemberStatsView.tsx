import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import MetricCard from '../MetricCard';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Printer, Download } from 'lucide-react';
import { generateMembersPDF, generateCollectorZip } from '@/utils/pdfGenerator';
import { useToast } from "@/hooks/use-toast";
import PDFGenerationProgress from '../PDFGenerationProgress';
import DownloadButtons from '../print/DownloadButtons';

const MemberStatsView = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, collector: '' });
  const { toast } = useToast();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['memberStats'],
    queryFn: async () => {
      // Get all members with collector information
      const { data: members } = await supabase
        .from('members')
        .select(`
          id, 
          gender, 
          date_of_birth,
          full_name,
          member_number,
          collector,
          members_collectors!members_collectors_member_number_fkey (
            name
          )
        `);

      // Get all family members
      const { data: familyMembers } = await supabase
        .from('family_members')
        .select('id, gender, date_of_birth');

      const allMembers = members || [];
      const allFamilyMembers = familyMembers || [];
      
      // Calculate age groups
      const calculateAge = (dob: string) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      };

      const getAgeGroup = (age: number) => {
        if (age < 18) return '0-17';
        if (age < 30) return '18-29';
        if (age < 50) return '30-49';
        if (age < 70) return '50-69';
        return '70+';
      };

      // Process members
      const memberStats = {
        total: allMembers.length,
        men: allMembers.filter(m => m.gender === 'male').length,
        women: allMembers.filter(m => m.gender === 'female').length,
        ageGroups: {} as Record<string, number>,
        membersByCollector: {} as Record<string, any[]>
      };

      // Group members by collector
      allMembers.forEach(member => {
        const collectorName = member.collector || 'Unassigned';
        if (!memberStats.membersByCollector[collectorName]) {
          memberStats.membersByCollector[collectorName] = [];
        }
        memberStats.membersByCollector[collectorName].push(member);
      });

      // Process family members
      const familyStats = {
        total: allFamilyMembers.length,
        men: allFamilyMembers.filter(m => m.gender === 'male').length,
        women: allFamilyMembers.filter(m => m.gender === 'female').length,
        ageGroups: {} as Record<string, number>
      };

      // Calculate age groups for members
      allMembers.forEach(member => {
        if (member.date_of_birth) {
          const age = calculateAge(member.date_of_birth);
          const group = getAgeGroup(age);
          memberStats.ageGroups[group] = (memberStats.ageGroups[group] || 0) + 1;
        }
      });

      // Calculate age groups for family members
      allFamilyMembers.forEach(member => {
        if (member.date_of_birth) {
          const age = calculateAge(member.date_of_birth);
          const group = getAgeGroup(age);
          familyStats.ageGroups[group] = (familyStats.ageGroups[group] || 0) + 1;
        }
      });

      return {
        members: memberStats,
        family: familyStats,
        total: memberStats.total + familyStats.total,
        totalMen: memberStats.men + familyStats.men,
        totalWomen: memberStats.women + familyStats.women,
      };
    }
  });

  const handleGenerateAllReports = async () => {
    if (!stats?.members.membersByCollector) {
      toast({
        title: "Error",
        description: "No member data available to export",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      const allMembers = Object.values(stats.members.membersByCollector).flat();

      // Generate master list PDF
      const masterDoc = generateMembersPDF(allMembers, 'Master Members List');
      masterDoc.save('master-members-list.pdf');

      // Generate collector-wise PDFs
      await generateCollectorZip(allMembers, (current, total, collector) => {
        setProgress({ current, total, collector });
      });

      toast({
        title: "Success",
        description: "Master list and collector reports generated successfully",
      });
    } catch (error) {
      console.error('Error generating PDFs:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF files",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateCollectorReport = async (collectorName: string) => {
    const collectorMembers = stats?.members.membersByCollector[collectorName] || [];
    if (!collectorMembers.length) {
      toast({
        title: "Error",
        description: "No members found for this collector",
        variant: "destructive",
      });
      return;
    }

    try {
      const doc = generateMembersPDF(collectorMembers, `Members List - Collector: ${collectorName}`);
      doc.save(`collector-${collectorName.toLowerCase().replace(/\s+/g, '-')}-members.pdf`);
      
      toast({
        title: "Success",
        description: "PDF report generated successfully",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading statistics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Member Statistics</h2>
        <div className="flex gap-4">
          <DownloadButtons 
            members={Object.values(stats?.members.membersByCollector || {}).flat()}
            className="flex gap-2"
          />
          <Button
            onClick={handleGenerateAllReports}
            className="flex items-center gap-2 bg-dashboard-accent1 hover:bg-dashboard-accent1/80"
            disabled={isGenerating}
          >
            <Printer className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Export All Reports'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Members"
          value={stats?.members.total || 0}
          color="#22c55e"
          details={`£${(stats?.members.total || 0) * 40} total yearly contributions`}
        />
        <MetricCard
          title="Direct Members"
          value={stats?.members.total || 0}
          color="#3b82f6"
          details={`£${(stats?.members.total || 0) * 40} yearly contributions`}
        />
        <MetricCard
          title="Family Members"
          value={stats?.family.total || 0}
          color="#8b5cf6"
          details={`£${(stats?.family.total || 0) * 40} yearly contributions`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 bg-dashboard-card/50 border-dashboard-cardBorder">
          <h3 className="text-lg font-medium text-white mb-4">Gender Distribution</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-500/10 rounded-lg">
              <p className="text-blue-400 text-sm">Men</p>
              <p className="text-2xl font-bold text-blue-500">{stats?.totalMen || 0}</p>
              <p className="text-sm text-blue-400/80">£{(stats?.totalMen || 0) * 40} yearly</p>
            </div>
            <div className="text-center p-4 bg-pink-500/10 rounded-lg">
              <p className="text-pink-400 text-sm">Women</p>
              <p className="text-2xl font-bold text-pink-500">{stats?.totalWomen || 0}</p>
              <p className="text-sm text-pink-400/80">£{(stats?.totalWomen || 0) * 40} yearly</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-dashboard-card/50 border-dashboard-cardBorder">
          <h3 className="text-lg font-medium text-white mb-4">Age Distribution</h3>
          <div className="grid grid-cols-5 gap-2">
            {['0-17', '18-29', '30-49', '50-69', '70+'].map(group => {
              const count = ((stats?.members.ageGroups[group] || 0) + (stats?.family.ageGroups[group] || 0));
              return (
                <div key={group} className="text-center p-2 bg-purple-500/10 rounded-lg">
                  <p className="text-purple-400 text-xs">{group}</p>
                  <p className="text-lg font-bold text-purple-500">{count}</p>
                  <p className="text-xs text-purple-400/80">£{count * 40}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-dashboard-card/50 border-dashboard-cardBorder">
        <h3 className="text-lg font-medium text-white mb-4">Collector Reports</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {stats?.members.membersByCollector && Object.entries(stats.members.membersByCollector).map(([collector, members]) => (
            <Card key={collector} className="p-4 bg-dashboard-card border-dashboard-cardBorder">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-white">{collector}</p>
                  <p className="text-sm text-dashboard-text">Members: {members.length}</p>
                </div>
                <Button
                  onClick={() => handleGenerateCollectorReport(collector)}
                  size="sm"
                  className="bg-dashboard-accent2 hover:bg-dashboard-accent2/80"
                >
                  <Printer className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MemberStatsView;
