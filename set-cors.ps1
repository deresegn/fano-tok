# Download the latest version of gsutil
$url = "https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe"
$output = "$PSScriptRoot\GoogleCloudSDKInstaller.exe"
Invoke-WebRequest -Uri $url -OutFile $output

# Run the installer
Start-Process -FilePath $output -ArgumentList "/S" -Wait

# Set the CORS configuration
gsutil cors set cors.json gs://fano-tok.appspot.com
