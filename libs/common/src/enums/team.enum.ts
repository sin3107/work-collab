export enum TeamRole {
  Owner = 'Owner',    // 최초 생성자
  Admin = 'Admin',    // 팀 관리 권한 보유
  Member = 'Member',  // 일반 팀원
  Guest = 'Guest',    // 읽기 전용 등 제한된 권한
}

export enum TeamVisibility {
  Public = 'Public',
  Private = 'Private',
}