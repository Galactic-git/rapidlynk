#define AppName "Rapidlynk"
#ifndef AppVersion
  #define AppVersion "0.5.50"
#endif
#ifndef BinarySource
  #define BinarySource "..\dist\rapidlynk-windows-amd64.exe"
#endif
#ifndef OutputBaseName
  #define OutputBaseName "Rapidlynk-Setup-" + AppVersion + "-x64"
#endif

[Setup]
AppId={{A8B8D2E9-6E43-4D80-9D38-6C0B4EC5D2A7}
AppName={#AppName}
AppVersion={#AppVersion}
AppPublisher=Rapidlynk
AppPublisherURL=https://github.com/Galactic-git/rapidlynk
DefaultDirName={localappdata}\Programs\Rapidlynk
DefaultGroupName={#AppName}
DisableDirPage=no
DisableProgramGroupPage=yes
PrivilegesRequired=lowest
PrivilegesRequiredOverridesAllowed=commandline
OutputDir=Output
OutputBaseFilename={#OutputBaseName}
Compression=lzma
SolidCompression=yes
UninstallDisplayIcon={app}\rapidlynk.exe
ArchitecturesInstallIn64BitMode=x64compatible
WizardStyle=modern
ChangesEnvironment=yes

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Files]
Source: "{#BinarySource}"; DestDir: "{app}"; DestName: "rapidlynk.exe"; Flags: ignoreversion

[Code]
const
  EnvironmentKey = 'Environment';
  PathValueName = 'Path';
  WM_SETTINGCHANGE = $001A;
  SMTO_ABORTIFHUNG = $0002;

function SendMessageTimeout(hWnd: Integer; Msg: Integer; wParam: Integer; lParam: String;
  fuFlags: Integer; uTimeout: Integer; out lpdwResult: Integer): Integer;
  external 'SendMessageTimeoutW@user32.dll stdcall';

function NormalizePath(Value: string): string;
begin
  Result := Lowercase(RemoveBackslashUnlessRoot(Trim(Value)));
end;

procedure SplitPath(Value: string; var Parts: TArrayOfString);
var
  Item: string;
  P: Integer;
begin
  SetArrayLength(Parts, 0);
  while True do
  begin
    P := Pos(';', Value);
    if P = 0 then
    begin
      Item := Value;
      Value := '';
    end
    else
    begin
      Item := Copy(Value, 1, P - 1);
      Delete(Value, 1, P);
    end;

    SetArrayLength(Parts, GetArrayLength(Parts) + 1);
    Parts[GetArrayLength(Parts) - 1] := Item;

    if P = 0 then
      break;
  end;
end;

function PathContainsEntry(PathValue, Entry: string): Boolean;
var
  I: Integer;
  Parts: TArrayOfString;
  NormalizedEntry: string;
begin
  Result := False;
  NormalizedEntry := NormalizePath(Entry);
  SplitPath(PathValue, Parts);
  for I := 0 to GetArrayLength(Parts) - 1 do
  begin
    if NormalizePath(Parts[I]) = NormalizedEntry then
    begin
      Result := True;
      exit;
    end;
  end;
end;

function AddPathEntry(PathValue, Entry: string): string;
begin
  Result := Trim(PathValue);
  if Result = '' then
    Result := Entry
  else if not PathContainsEntry(Result, Entry) then
    Result := Result + ';' + Entry;
end;

function RemovePathEntry(PathValue, Entry: string): string;
var
  I, Count: Integer;
  Parts: TArrayOfString;
  NormalizedEntry: string;
begin
  Result := '';
  Count := 0;
  NormalizedEntry := NormalizePath(Entry);
  SplitPath(PathValue, Parts);
  for I := 0 to GetArrayLength(Parts) - 1 do
  begin
    if Trim(Parts[I]) = '' then
      continue;
    if NormalizePath(Parts[I]) = NormalizedEntry then
      continue;

    if Count = 0 then
      Result := Trim(Parts[I])
    else
      Result := Result + ';' + Trim(Parts[I]);
    Count := Count + 1;
  end;
end;

procedure BroadcastEnvironmentChange;
var
  ResultCode: Integer;
begin
  SendMessageTimeout($FFFF, WM_SETTINGCHANGE, 0, 'Environment',
    SMTO_ABORTIFHUNG, 5000, ResultCode);
end;

procedure UpdateUserPath(AddEntry: Boolean);
var
  CurrentPath, NewPath, InstallDir: string;
begin
  InstallDir := ExpandConstant('{app}');
  if not RegQueryStringValue(HKCU, EnvironmentKey, PathValueName, CurrentPath) then
    CurrentPath := '';

  if AddEntry then
    NewPath := AddPathEntry(CurrentPath, InstallDir)
  else
    NewPath := RemovePathEntry(CurrentPath, InstallDir);

  if NewPath <> CurrentPath then
  begin
    RegWriteExpandStringValue(HKCU, EnvironmentKey, PathValueName, NewPath);
    BroadcastEnvironmentChange;
  end;
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssPostInstall then
    UpdateUserPath(True);
end;

procedure CurUninstallStepChanged(CurUninstallStep: TUninstallStep);
begin
  if CurUninstallStep = usUninstall then
    UpdateUserPath(False);
end;
