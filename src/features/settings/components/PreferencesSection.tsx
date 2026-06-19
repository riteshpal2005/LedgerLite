import { View, Text, Switch, Pressable, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../core/store/store";
import { toggleShowIcons, toggleHaptics } from "../../../core/store/settingsSlice";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, ThemeOption } from "../../../core/theme/ThemeContext";

export function PreferencesSection() {
  const showIcons = useSelector((state: RootState) => state.settings.showIcons);
  const hapticsEnabled = useSelector((state: RootState) => state.settings.hapticsEnabled);
  const dispatch = useDispatch();
  const { themeOption, setThemeOption, activeThemeClass } = useTheme();

  const CustomToggle = ({ value, onValueChange }: { value: boolean, onValueChange: (v: boolean) => void }) => {
    const getTrackColor = () => {
      if (value) return '#2563eb'; // Blue
      return activeThemeClass === '' ? '#000000' : '#3f3f46'; // Black in Light, Grey in Dark
    };

    return (
      <Pressable 
        onPress={() => onValueChange(!value)}
        style={{ backgroundColor: getTrackColor() }}
        className="w-12 h-6 rounded-full justify-center px-1"
      >
        <View className={`w-4 h-4 rounded-full bg-white shadow-sm ${value ? 'self-end' : 'self-start'}`} />
      </Pressable>
    );
  };

  const ThemeButton = ({ title, value }: { title: string, value: ThemeOption }) => {
    const isActive = themeOption === value;
    return (
      <Pressable 
        onPress={() => setThemeOption(value)} 
        className={`px-3 py-2 rounded-lg border ${isActive ? 'bg-blue-600 border-blue-500' : 'bg-background border-bordercolor'} mr-2`}
      >
        <Text className={`${isActive ? 'text-white' : 'text-secondary'} font-bold text-xs`}>{title}</Text>
      </Pressable>
    )
  };

  return (
    <>
      <Text className="text-secondary font-bold mb-2 uppercase text-xs tracking-wider">Preferences</Text>
      <View className="bg-surface rounded-2xl p-4 border border-bordercolor">
        
        <View className="mb-4">
          <Text className="text-primary text-lg font-semibold mb-3">App Theme</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            <ThemeButton title="System" value="system" />
            <ThemeButton title="Light" value="light" />
            <ThemeButton title="Dark" value="dark" />
            <ThemeButton title="Pitch Black" value="pitch-black" />
          </ScrollView>
        </View>

        <View className="h-[1px] bg-bordercolor mb-4" />

        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <Ionicons name="image" size={24} color="#71717a" />
            <Text className="text-primary text-lg font-semibold ml-3">Show Category Icons</Text>
          </View>
          <CustomToggle
            value={showIcons}
            onValueChange={() => { dispatch(toggleShowIcons()); }}
          />
        </View>

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="radio" size={24} color="#71717a" />
            <Text className="text-primary text-lg font-semibold ml-3">Haptic Feedback</Text>
          </View>
          <CustomToggle
            value={hapticsEnabled}
            onValueChange={() => { dispatch(toggleHaptics()); }}
          />
        </View>
      </View>
    </>
  );
}
