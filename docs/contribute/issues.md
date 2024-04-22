# Issues

## M1 canvas
error - Error: dlopen(/Users/leeson/Downloads/code/apitool/node_modules/.pnpm/canvas@2.9.1/node_modules/canvas/build/Release/canvas.node, 0x0001): symbol not found in flat namespace '_cairo_fill'  

```
sudo mkdir /opt/homebrew
sudo chown -R $(whoami) /opt/homebrew
curl -L https://github.com/Homebrew/brew/tarball/master | tar xz --strip 1 -C homebrew
```

.zshrc
```
# HomeBrew
export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles
export PATH="/opt/homebrew/bin:$PATH"  
export PATH="/opt/homebrew/sbin:$PATH"
# HomeBrew END
```

```
arch -arm64 brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
pnpm i
```

