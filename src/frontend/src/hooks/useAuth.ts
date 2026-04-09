import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import type { Identity } from "@icp-sdk/core/agent";

export type AuthState = {
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoggingIn: boolean;
  identity: Identity | undefined;
  principal: string | undefined;
  login: () => void;
  logout: () => void;
};

/**
 * useAuth — wraps Internet Identity from core-infrastructure.
 * Provides isAuthenticated, login, logout, principal, and identity.
 */
export function useAuth(): AuthState {
  const { identity, login, clear, isInitializing, isLoggingIn } =
    useInternetIdentity();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const principal = isAuthenticated
    ? identity?.getPrincipal().toText()
    : undefined;

  return {
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    identity,
    principal,
    login,
    logout: clear,
  };
}
