import AvatarUpload from "@/components/upload/AvatarUpload"

const ProfileSettings = ({ profile }) => {
  return (
    <div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Profile Picture</label>
        <AvatarUpload
          currentAvatar={profile?.avatar}
          onUpload={(file) => {
            // Handle avatar upload
            console.log("Avatar uploaded:", file)
          }}
          onError={(error) => {
            console.error("Avatar upload error:", error)
          }}
          size={120}
        />
      </div>
    </div>
  )
}

export default ProfileSettings
