// src/lib/auditLog.ts
export const logAdminAction = async (
  adminId: string,
  action: string,
  resourceId: string,
  details: any
) => {
  await supabase.from('audit_logs').insert({
    admin_id: adminId,
    action,
    resource_id: resourceId,
    details,
    ip_address: await getClientIP(),
    timestamp: new Date().toISOString()
  });
};

// Use in adminService
async publishGig(gigId: string, adminId: string) {
  const { error } = await supabase
    .from('gigs')
    .update({ status: 'available' })
    .eq('id', gigId);
    
  if (!error) {
    await logAdminAction(adminId, 'PUBLISH_GIG', gigId, { status: 'available' });
  }
}
